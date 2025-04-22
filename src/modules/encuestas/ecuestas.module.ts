import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controllers';
import { EncuestaService } from './services/encuesta.service';

@Module({
    imports: [],
    controllers: [EncuestasController],
    providers: [EncuestaService],
})

export class EncuestasModule {

}
