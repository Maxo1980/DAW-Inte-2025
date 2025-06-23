import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreacionEncuestaComponent } from './components/creacion-encuesta/creacion-encuesta.component';
import { PresentacionEnlacesComponent } from './components/presentacion-enlaces/presentacion-enlaces.component';
import { VisualizarEncuestaComponent } from './components/visualizar-encuesta/visualizar-encuesta.component';

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
        path: 'presentacion-enlaces',
        component: PresentacionEnlacesComponent,
    },
    {
        path: 'encuestas/:id',
        component: VisualizarEncuestaComponent
    },
    {
        path: '**',
        redirectTo: '',
    },
];
