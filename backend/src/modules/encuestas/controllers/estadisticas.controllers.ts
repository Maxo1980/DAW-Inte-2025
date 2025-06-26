import { Controller, Post, Body } from '@nestjs/common';
import { EstadisticasService } from '../services/estadisticas.service';

@Controller('/ia')
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) { }

    @Post('resumen-palabras-clave')
    async obtenerResumenYPalabras(@Body() body: { respuestas: string[] }) {
        return this.estadisticasService.analizarRespuestasAbiertas(body.respuestas);
    }
}