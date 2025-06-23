import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controllers';
import { EncuestasService } from './services/encuesta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuesta } from './entities/encuesta.entity';
import { Pregunta } from './entities/pregunta.entity';
import { Opcion } from './entities/opcion.entity';
import { Respuesta } from './entities/respuesta.entity';
import { RespuestaAbierta } from './entities/respuesta-abierta.entity';
import { RespuestaConOpciones } from './entities/respuesta-opciones.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Encuesta, Pregunta, Opcion, RespuestaAbierta, Respuesta, RespuestaConOpciones])],
    controllers: [EncuestasController],
    providers: [EncuestasService],
})

export class EncuestasModule {

}
