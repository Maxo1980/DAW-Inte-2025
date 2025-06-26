import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
    constructor(private http: HttpClient) { }

    obtenerResumenYPalabras(respuestas: string[]) {
        return this.http.post<{ resumen: string; palabrasClave: string[] }>(
            '/api/v1/ia/resumen-palabras-clave',
            { respuestas }
        );
    }
}