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

                const opciones = Object.keys(conteo);
                const values = Object.values(conteo);
                const total = values.reduce((sum, val) => sum + val, 0);
                const labels = opciones.map((opcion, idx) => {
                    const porcentaje = ((values[idx] / total) * 100).toFixed(1);
                    return `${opcion} (${porcentaje}%)`;
                });
                console.log(conteo)
                estadisticas.push({
                    pregunta: texto,
                    chartData: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Votos',
                                data: Object.values(conteo),
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(75, 192, 192)',
                                    'rgb(153, 102, 255)',
                                    'rgb(255, 159, 64)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(201, 203, 207)'
                                ],
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

                const opciones = Object.keys(conteo);
                const values = Object.values(conteo);
                const total = values.reduce((sum, val) => sum + val, 0);
                const labels = opciones.map((opcion, idx) => {
                    const porcentaje = ((values[idx] / total) * 100).toFixed(1);
                    return `${opcion} (${porcentaje}%)`;
                });
                estadisticas.push({
                    pregunta: texto,
                    chartData: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Cantidad de selecciones',
                                data: Object.values(conteo),
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(75, 192, 192)',
                                    'rgb(153, 102, 255)',
                                    'rgb(255, 159, 64)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(201, 203, 207)'
                                ],
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