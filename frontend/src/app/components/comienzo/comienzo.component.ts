import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-comienzo',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, RouterModule],
    templateUrl: './comienzo.component.html',
    styleUrls: ['./comienzo.component.css'],
})
export class ComienzoComponent { }