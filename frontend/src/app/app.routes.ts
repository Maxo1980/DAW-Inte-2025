import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreacionEncuestaComponent } from './components/creacion-encuesta/creacion-encuesta.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'creacion',
        component: CreacionEncuestaComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
