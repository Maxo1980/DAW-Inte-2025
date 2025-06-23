export interface ResultadoEncuestaDTO {
    nombre: string;
    resultados: ResultadoRespuesta[];
}

export interface ResultadoRespuesta {
    id: number;
    idEncuesta: number;
    respuestas: PreguntaResultado[];
}

export type PreguntaResultado = PreguntaAbiertaResultado | PreguntaOpcionResultado;

export interface PreguntaAbiertaResultado {
    idPregunta: number;
    tipo: 'ABIERTA';
    texto: string;
    textoRespuesta: string;
}

export interface PreguntaOpcionResultado {
    idPregunta: number;
    tipo: 'OPCION';
    texto: string;
    opciones: {
        id: number;
        texto: string;
        seleccionada: boolean;
    }[];
}