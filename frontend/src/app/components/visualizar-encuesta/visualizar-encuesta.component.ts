import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ContestarEncuestaDTO } from '../../interfaces/contestar-encuesta.dto';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';
import { EstadisticaDTO } from '../../interfaces/estadisticas.dto';

@Component({
    selector: 'app-visualizar-encuesta',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, FormsModule, RadioButtonModule, CheckboxModule, TextareaModule, DialogModule, AccordionModule, EstadisticasComponent],
    templateUrl: './visualizar-encuesta.component.html',
    styleUrls: ['./visualizar-encuesta.component.css']
})
export class VisualizarEncuestaComponent implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private encuestaService = inject(EncuestasService);
    private confirmationService: ConfirmationService =
        inject(ConfirmationService);

    formulario!: FormGroup;
    cargando = true;
    error = '';
    tipoVista: 'RESPUESTA' | 'RESULTADOS' | '' = '';
    nombreEncuesta: string = '';
    idEncuesta!: number;
    mostrarDialogo = false;
    resultados: any[] = [];
    estadisticas: EstadisticaDTO[] = [];

    ngOnInit() {
        this.formulario = this.fb.group({
            preguntas: this.fb.array([]),
        });

        this.idEncuesta = Number(this.route.snapshot.paramMap.get('id'));
        const codigo = this.route.snapshot.queryParamMap.get('codigo') ?? '';
        const tipo = this.route.snapshot.queryParamMap.get('tipo') ?? '';

        this.tipoVista = tipo === 'RESPUESTA' || tipo === 'RESULTADOS' ? tipo : '';

        if (!this.idEncuesta || !this.tipoVista) {
            this.error = 'Parámetros inválidos.';
            this.cargando = false;
            return;
        }

        if (this.tipoVista === 'RESULTADOS') {
            this.encuestaService.obtenerResultados(this.idEncuesta).subscribe({
                next: (resultados) => {
                    if (resultados.resultados.length === 0) {
                        this.error = 'Aún no hay respuestas';
                        this.cargando = false;
                        return;
                    }
                    this.nombreEncuesta = resultados.nombre;
                    this.cargarRespuestas(resultados.resultados);
                    this.cargando = false;
                },
                error: (err) => {
                    console.error(err);
                    this.error = 'Error al cargar resultados';
                    this.cargando = false;
                }
            });
        } else {
            if (!codigo) {
                this.error = 'Código inválido.';
                this.cargando = false;
                return;
            }

            this.encuestaService.obtenerEncuesta(this.idEncuesta, codigo, tipo as any).subscribe({
                next: (encuesta) => {
                    this.cargarFormulario(encuesta.preguntas);
                    this.nombreEncuesta = encuesta.nombre;
                    this.cargando = false;
                },
                error: (err) => {
                    this.error = 'Error al cargar la encuesta.';
                    this.cargando = false;
                }
            });
        }
    }

    get preguntas() {
        return this.formulario.get('preguntas') as FormArray;
    }

    private cargarFormulario(preguntasData: any[]) {
        preguntasData.forEach(preg => {
            const grupoPregunta = this.fb.group({
                id: [preg.id],
                texto: [preg.texto, Validators.required],
                tipo: [preg.tipo, Validators.required],
                respuesta: [''],
                opciones: [preg.opciones || []],
            });
            this.preguntas.push(grupoPregunta);
        });
    }

    private cargarRespuestas(respuestas: any[]) {
        this.resultados = respuestas.map((respuesta, index) => ({
            id: respuesta.id,
            respuestas: respuesta.respuestas.map((pregunta: any) => ({
                texto: pregunta.texto,
                tipo: pregunta.tipo,
                opciones: pregunta.opciones || [],
                textoRespuesta: pregunta.textoRespuesta || null,
            }))
        }));
    }

    getSeleccionSimple(pregunta: any): string | null {
        const seleccionada = pregunta.opciones?.find((o: any) => o.seleccionada);
        return seleccionada?.texto ?? null;
    }

    onCheckboxChange(preguntaIndex: number, opcionTexto: string, event: CheckboxChangeEvent) {
        const control = this.preguntas.at(preguntaIndex).get('respuesta');
        const respuestas = control?.value || []
        if (!respuestas.includes(opcionTexto)) {
            respuestas.push(opcionTexto);
        } else {
            const index = respuestas.indexOf(opcionTexto);
            respuestas.splice(index, 1);
        }

        control?.setValue([...respuestas]);

    }

    confirmarRespuesta() {
        this.confirmationService.confirm({
            message: 'Confirmar envio de formulario?',
            header: 'Enviar respuestas',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Confirmar',
            },
            accept: () => {
                this.enviar();
            },
        });
    }

    enviar() {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }
        const respuestas: any[] = this.preguntas.controls.map(pregunta => {
            const tipo = pregunta.get('tipo')?.value;
            const idPregunta = pregunta.get('id')?.value;

            if (tipo === 'ABIERTA') {
                return {
                    idPregunta,
                    texto: pregunta.get('respuesta')?.value,
                };
            } else if (tipo === 'OPCION_MULTIPLE_SELECCION_SIMPLE') {
                return {
                    idPregunta,
                    idRespuesta: pregunta.get('opciones')?.value.find((opt: any) => opt.texto === pregunta.value.respuesta)?.id,
                    texto: pregunta.get('texto')?.value
                };
            } else if (tipo === 'OPCION_MULTIPLE_SELECCION_MULTIPLE') {
                const seleccionadas: string[] = pregunta.get('respuesta')?.value || [];
                return seleccionadas.map(textoOpcion => ({
                    idPregunta,
                    idRespuesta: pregunta.get('opciones')?.value.find((opt: any) => opt.texto === textoOpcion)?.id,
                    texto: pregunta.get('opciones')?.value.find((opt: any) => opt.texto === textoOpcion).texto
                }));
            }

            return null;
        }).flat().filter(r => r !== null);

        const dto: ContestarEncuestaDTO = {
            idEncuesta: this.idEncuesta,
            respuestas,
        };

        this.encuestaService.contestarEncuesta(dto).subscribe({
            next: (res) => {
                this.mostrarDialogo = true;
            },
            error: (err) => {
                console.error('Error al enviar respuestas', err);
            }
        });
    }

}
