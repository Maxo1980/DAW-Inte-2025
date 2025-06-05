import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controllers';
import { EncuestasService } from './services/encuesta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuesta } from './entities/encuesta.entity';
import { Pregunta } from './entities/pregunta.entity';
import { Opcion } from './entities/opcion.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Encuesta, Pregunta, Opcion])], // Añadimos las entidades que vamos a usar en el módulo
    controllers: [EncuestasController],
    providers: [EncuestasService],
})

export class EncuestasModule {

}
