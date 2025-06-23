import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateEncuestaDTO } from "../interfaces/create-encuesta.dto";
import { Observable } from "rxjs";
import { CodigoTipoEnum } from "../enums/codigo-tipo.enum";
import { EncuestaDTO } from "../interfaces/encuesta.dto";
import { ContestarEncuestaDTO } from "../interfaces/contestar-encuesta.dto";
import { ResultadoEncuestaDTO } from "../interfaces/resultado-encuesta.dto";

@Injectable({ providedIn: 'root' })
export class EncuestasService {

    private httpClient = inject(HttpClient);

    crearEncuesta(dto: CreateEncuestaDTO): Observable<{
        id: number;
        codigoRespuesta: string;
        codigoResultados: string;
    }> {
        return this.httpClient.post<{
            id: number;
            codigoRespuesta: string;
            codigoResultados: string;
        }>('/api/v1/encuestas', dto);
    }

    obtenerEncuesta(
        idEncuesta: number,
        codigo: string,
        tipo: CodigoTipoEnum,
    ): Observable<EncuestaDTO> {
        return this.httpClient.get<EncuestaDTO>(
            '/api/v1/encuestas/' + idEncuesta + '?codigo=' + codigo + '&tipo=' + tipo,
        );
    }

    contestarEncuesta(dto: ContestarEncuestaDTO): Observable<{
        status: string
    }> {
        return this.httpClient.post<{
            status: string;
        }>('/api/v1/encuestas/save', dto);
    }

    obtenerResultados(idEncuesta: number): Observable<ResultadoEncuestaDTO> {
        return this.httpClient.get<ResultadoEncuestaDTO>(`/api/v1/encuestas/resultados/${idEncuesta}`);
    }
}