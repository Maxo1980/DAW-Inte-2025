import { Module } from '@nestjs/common';
import { EstadisticasController } from './controllers/estadisticas.controllers';
import { EstadisticasService } from './services/estadisticas.service';

@Module({
    imports: [],
    controllers: [EstadisticasController],
    providers: [EstadisticasService],
})

export class EstadisticasModule {

}
