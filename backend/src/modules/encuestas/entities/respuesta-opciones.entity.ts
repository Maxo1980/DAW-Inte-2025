import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'respuestas_opciones' })
export class RespuestaConOpciones {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'id_pregunta' })
    idPregunta: number;

    @Column({ name: 'id_respuesta' })
    idRespuesta: number;

    @Column({ name: 'id_opcion' })
    idOpcion: number;
}