
import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { EncuestasService } from '../services/encuesta.service';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { Encuesta } from '../entities/encuesta.entity';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { ContestarEncuestaDTO } from '../dtos/contestar-encuesta.dto';
import {Response} from 'express';

@Controller('/encuestas')
export class EncuestasController {

    constructor(private encuestasService: EncuestasService) { }

    @Post()
    async crearEncuesta(@Body() dto: CreateEncuestaDTO): Promise<{
        id: number;
        codigoRespuesta: string;
        codigoResultados: string;
    }> {
        return await this.encuestasService.crearEncuesta(dto);
    }

    @Get(':id')
    async obtenerEncuesta(
        @Param('id') id: number,
        @Query() dto: ObtenerEncuestaDto,
    ): Promise<Encuesta> {
        return await this.encuestasService.obtenerEncuesta(
            id,
            dto.codigo,
            dto.tipo,
        );
    }

    @Post(':save')
    async contestarEncuesta(@Body() dto: ContestarEncuestaDTO): Promise<{
        status: string;
    }> {
        return await this.encuestasService.contestarEncuesta(dto);
    }

    @Get('resultados/:idEncuesta')
    async obtenerResultados(@Param('idEncuesta') id: number) {
        return this.encuestasService.obtenerResultadosPorEncuesta(id);
    }

    @Get(':id/pdf')
    async exportEncuestaResumenPdf(
    @Param('id') id: number,
    @Query() dto: ObtenerEncuestaDto,
    @Res() res: Response,
    ) {
    const pdfBuffer = await this.encuestasService.generarResumenPdf(id, dto.codigo);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=encuesta_${id}_resumen.pdf`,
    });

    res.end(pdfBuffer);
  }
}