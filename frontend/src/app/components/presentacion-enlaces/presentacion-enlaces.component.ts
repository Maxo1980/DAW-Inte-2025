import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-presentacion-enlaces',
  templateUrl: './presentacion-enlaces.component.html',
  styleUrls: ['./presentacion-enlaces.component.css'],
  standalone: true,
  imports: [],
})
export class PresentacionEnlacesComponent {
  encuestaId: string = '';
  codigoRespuesta: string = '';
  codigoResultados: string = '';

  constructor(private route: ActivatedRoute, private clipboard: Clipboard) {
    this.route.queryParams.subscribe((params: { [key: string]: any }) => {
      this.encuestaId = params['id-encuesta'];
      this.codigoRespuesta = params['codigo-respuesta'];
      this.codigoResultados = params['codigo-resultados'];
    });
  }

  get linkRespuesta(): string {
    return `http://localhost:4200/respuesta/${this.encuestaId}/${this.codigoRespuesta}`;
  }

  get linkResultados(): string {
    return `http://localhost:4200/resultados/${this.encuestaId}/${this.codigoResultados}`;
  }

  copiar(texto: string) {
    this.clipboard.copy(texto);
  }
}
