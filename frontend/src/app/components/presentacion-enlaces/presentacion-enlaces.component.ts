import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { PresentacionQRComponent } from '../presentacion-qr/presentacion-qr.component';

@Component({
    selector: 'app-presentacion-enlaces',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, RouterModule, TooltipModule, PopoverModule,PresentacionQRComponent  ],
    templateUrl: './presentacion-enlaces.component.html',
    styleUrls: ['./presentacion-enlaces.component.css'],
})
export class PresentacionEnlacesComponent {
    @ViewChild('op') popover: any;
    enlaceRespuesta = '';
    enlaceResultados = '';
    mostrarPopover = false;

    constructor(private route: ActivatedRoute) {
        const id = this.route.snapshot.queryParamMap.get('id-encuesta');
        const codigoRespuesta = this.route.snapshot.queryParamMap.get('codigo-respuesta');
        const codigoResultados = this.route.snapshot.queryParamMap.get('codigo-resultados');

        if (id && codigoRespuesta && codigoResultados) {
            this.enlaceRespuesta = `http://localhost:4200/encuestas/${id}?codigo=${codigoRespuesta}&tipo=RESPUESTA`;
            this.enlaceResultados = `http://localhost:4200/encuestas/${id}?codigo=${codigoResultados}&tipo=RESULTADOS`;
        }
    }


    copiarTexto(id: string) {
        const texto = document.getElementById(id)?.textContent;
        if (texto) {
            navigator.clipboard.writeText(texto).then(() => {
                setTimeout(() => {
                    this.popover.hide();
                }, 500);
            }).catch(err => {
                console.error('Error al copiar el texto', err);
            });
        }
    }
}