import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { EstadisticaDTO, ResumenAbiertasDTO } from '../../interfaces/estadisticas.dto';
import { EstadisticasService } from '../../services/estadisticas.service';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'app-estadisticas',
    standalone: true,
    imports: [CommonModule, ChartModule, ChipModule],
    templateUrl: './estadisticas.component.html',
})

export class EstadisticasComponent implements OnChanges {
    constructor(private estadisticasService: EstadisticasService) { }

    @Input() resultados: any[] = [];

    estadisticas: EstadisticaDTO[] = [];
    resumenAbiertas?: ResumenAbiertasDTO;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['resultados'] && this.resultados.length > 0) {
            this.estadisticas = this.generarEstadisticasDesdeResultados(this.resultados);
            const respuestasAbiertas = this.resultados.flatMap(res =>
                res.respuestas
                    .filter((r: any) => r.tipo === 'ABIERTA' && r.textoRespuesta?.trim())
                    .map((r: any) => r.textoRespuesta.trim())
            );

            if (respuestasAbiertas.length) {
                this.estadisticasService.obtenerResumenYPalabras(respuestasAbiertas).subscribe(result => {
                    this.resumenAbiertas = {
                        pregunta: 'Resumen de respuestas abiertas',
                        resumen: result.resumen,
                        palabrasClave: result.palabrasClave
                    };
                });
            } else {
                this.resumenAbiertas = undefined;
            }
        }
    }

    private generarEstadisticasDesdeResultados(resultados: any[]): EstadisticaDTO[] {
        const estadisticas: any[] = [];
        console.log('res', resultados)

        const cantidadPreguntas = resultados[0].respuestas.length;

        for (let i = 0; i < cantidadPreguntas; i++) {
            const preguntaBase = resultados[0].respuestas[i];
            const tipo = preguntaBase.tipo;
            const texto = preguntaBase.texto;

            if (tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE') {
                const conteo: Record<string, number> = {};

                preguntaBase.opciones.forEach((op: any) => {
                    conteo[op.texto] = 0;
                });

                resultados.forEach(res => {
                    const respuesta = res.respuestas[i];
                    const seleccionada = respuesta.opciones.find((o: any) => o.seleccionada)?.texto;
                    if (seleccionada) {
                        conteo[seleccionada]++;
                    }
                });

                estadisticas.push({
                    pregunta: texto,
                    chartData: {
                        labels: Object.keys(conteo),
                        datasets: [
                            {
                                data: Object.values(conteo),
                                backgroundColor: ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa']
                            }
                        ]
                    },
                    chartType: 'pie'
                });
            }

            if (tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE') {
                const conteo: Record<string, number> = {};

                preguntaBase.opciones.forEach((op: any) => {
                    conteo[op.texto] = 0;
                });

                resultados.forEach(res => {
                    const respuesta = res.respuestas[i];
                    respuesta.opciones.forEach((op: any) => {
                        if (op.seleccionada) {
                            if (conteo.hasOwnProperty(op.texto)) {
                                conteo[op.texto]++;
                            }
                        }
                    });
                });

                estadisticas.push({
                    pregunta: texto,
                    chartData: {
                        labels: Object.keys(conteo),
                        datasets: [
                            {
                                label: 'Cantidad de selecciones',
                                data: Object.values(conteo),
                                backgroundColor: ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa']
                            }
                        ]
                    },
                    chartType: 'bar'
                });

            }
        }

        return estadisticas;
    }
}