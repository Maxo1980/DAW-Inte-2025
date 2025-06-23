export interface ContestarEncuestaDTO {
    idEncuesta: number;
    respuestas: {
        idPregunta: number;
        texto?: string;
        idRespuesta?: number;
    }[];
}