import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import QRCode from 'qrcode';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-presentacion-qr',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './presentacion-qr.component.html',
  styleUrls: ['./presentacion-qr.component.css'],
})
export class PresentacionQRComponent implements OnChanges {
  @Input() value: string = '';
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      QRCode.toCanvas(this.canvas.nativeElement, this.value, { width: 200 }, (error) => {
        if (error) console.error(error);
      });
    }
  }

  descargarQR() {
    const canvasEl = this.canvas.nativeElement;
    const url = canvasEl.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codigo-qr.png';
    a.click();
  }
}
