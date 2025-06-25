import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { Encuesta } from '../entities/encuesta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { ContestarEncuestaDTO } from '../dtos/contestar-encuesta.dto';
import { Respuesta } from '../entities/respuesta.entity';
import { RespuestaAbierta } from '../entities/respuesta-abierta.entity';
import { RespuestaConOpciones } from '../entities/respuesta-opciones.entity';
import { groupBy } from 'lodash';
import { Opcion } from '../entities/opcion.entity';
import { Pregunta } from '../entities/pregunta.entity';

@Injectable()
export class EncuestasService {

    constructor(
        @InjectRepository(Encuesta)
        private encuestasRepository: Repository<Encuesta>,

        @InjectRepository(RespuestaAbierta)
        private respuestaAbiertaRepository: Repository<RespuestaAbierta>,

        @InjectRepository(RespuestaConOpciones)
        private respuestaConOpcionesRepository: Repository<RespuestaConOpciones>,

        @InjectRepository(Respuesta)
        private respuestaRepository: Repository<Respuesta>,

        @InjectRepository(Opcion)
        private opcionRepository: Repository<Opcion>,

        @InjectRepository(Pregunta)
        private readonly preguntaRepository: Repository<Pregunta>,
    ) { }

    async crearEncuesta(dto: CreateEncuestaDTO): Promise<{
        id: number;
        codigoRespuesta: string;
        codigoResultados: string;
    }> {
        const encuesta: Encuesta = this.encuestasRepository.create({
            ...dto,
            codigoRespuesta: v4(),
            codigoResultados: v4(),
        });

        const encuestaGuardada = await this.encuestasRepository.save(encuesta);

        return {
            id: encuestaGuardada.id,
            codigoRespuesta: encuestaGuardada.codigoRespuesta,
            codigoResultados: encuestaGuardada.codigoResultados,
        };
    }

    async obtenerEncuesta(
        id: number,
        codigo: string,
        codigoTipo: CodigoTipoEnum.RESPUESTA | CodigoTipoEnum.RESULTADOS,
    ): Promise<Encuesta> {
        const query = this.encuestasRepository
            .createQueryBuilder('encuesta')
            .innerJoinAndSelect('encuesta.preguntas', 'pregunta')
            .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
            .where('encuesta.id = :id', { id });

        switch (codigoTipo) {
            case CodigoTipoEnum.RESPUESTA:
                query.andWhere('encuesta.codigoRespuesta = :codigo', { codigo });
                break;

            case CodigoTipoEnum.RESULTADOS:
                query.andWhere('encuesta.codigoResultados = :codigo', { codigo });
                break;
        }

        query.orderBy('pregunta.numero', 'ASC');
        query.addOrderBy('preguntaOpcion.numero', 'ASC');

        const encuesta = await query.getOne();

        if (!encuesta) {
            throw new BadRequestException('Datos de encuesta no válidos');
        }

        return encuesta;
    }

    async contestarEncuesta(dto: ContestarEncuestaDTO): Promise<{
        status: string;
    }> {
        const entidadRespuesta = new Respuesta();
        entidadRespuesta.idEncuesta = dto.idEncuesta;

        const respuestaGuardada = await this.respuestaRepository.save(entidadRespuesta);

        var respuestasAbiertas = dto.respuestas.filter(respuesta => respuesta.idRespuesta == null)
        var respuestasConOpciones = dto.respuestas.filter(respuesta => respuesta.idRespuesta != null)

        const entidadesAbiertas: RespuestaAbierta[] = respuestasAbiertas.map(resp => {
            const entidad = new RespuestaAbierta();
            entidad.texto = resp.texto;
            entidad.idPregunta = resp.idPregunta;
            entidad.idRespuesta = respuestaGuardada.id;
            return entidad;
        });

        const entidadesConOpciones: RespuestaConOpciones[] = respuestasConOpciones.map(resp => {
            const entidad = new RespuestaConOpciones();
            entidad.idPregunta = resp.idPregunta;
            entidad.idRespuesta = respuestaGuardada.id;
            entidad.idOpcion = resp.idRespuesta!
            return entidad;
        });

        await this.respuestaAbiertaRepository.save(entidadesAbiertas)
        await this.respuestaConOpcionesRepository.save(entidadesConOpciones)

        return {
            status: 'Respuestas guardadas',
        };
    }

    async obtenerResultadosPorEncuesta(idEncuesta: number) {
        const encuesta = await this.encuestasRepository.findOneBy({ id: idEncuesta });

        const respuestas = await this.respuestaRepository.find({
            where: { idEncuesta },
        });

        const resultados = await Promise.all(
            respuestas.map(async (respuesta) => {
                const idRespuesta = respuesta.id;

                const abiertas = await this.respuestaAbiertaRepository.find({
                    where: { idRespuesta },
                });

                const respuestasAbiertas = await Promise.all(
                    abiertas.map(async (a) => {
                        const pregunta = await this.preguntaRepository.findOneBy({ id: a.idPregunta });
                        return {
                            idPregunta: a.idPregunta,
                            tipo: 'ABIERTA',
                            texto: pregunta?.texto ?? '',
                            textoRespuesta: a.texto,
                        };
                    })
                );

                const opcionesSeleccionadas = await this.respuestaConOpcionesRepository.find({
                    where: { idRespuesta },
                });

                const opcionesAgrupadas = await Promise.all(
                    Object.entries(
                        groupBy(opcionesSeleccionadas, 'idPregunta') as Record<string, RespuestaConOpciones[]>
                    ).map(async ([idPregunta, filas]) => {
                        const idPreg = +idPregunta;
                        const seleccionadas = new Set(filas.map((f) => f.idOpcion));

                        const todasOpciones = await this.opcionRepository.find({
                            where: { pregunta: { id: idPreg } },
                            relations: ['pregunta'],
                        });

                        const pregunta = todasOpciones[0]?.pregunta;
                        const tipo = pregunta?.tipo ?? 'DESCONOCIDO';
                        const textoPregunta = pregunta?.texto ?? '';

                        return {
                            idPregunta: idPreg,
                            tipo,
                            texto: textoPregunta,
                            opciones: todasOpciones.map((opt) => ({
                                id: opt.id,
                                texto: opt.texto,
                                seleccionada: seleccionadas.has(opt.id),
                            })),
                        };
                    })
                );

                const respuestasCombinadas = [
                    ...respuestasAbiertas,
                    ...opcionesAgrupadas,
                ];

                return {
                    id: respuesta.id,
                    idEncuesta: respuesta.idEncuesta,
                    respuestas: respuestasCombinadas,
                };
            })
        );

        return {
            nombre: encuesta?.nombre ?? 'Encuesta sin nombre',
            resultados,
        };
    }
}