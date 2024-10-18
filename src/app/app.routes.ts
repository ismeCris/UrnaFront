import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { UrnaComponent } from './components/urna/urna.component';
import { CandidatoListComponent } from './components/candidato/candidato-list/candidato-list.component';
import { CandidatoFormComponent } from './components/candidato/candidato-form/candidato-form.component';
import { EleitorListComponent } from './components/eleitor/eleitor-list/eleitor-list.component';
import { EleitorFormComponent } from './components/eleitor/eleitor-form/eleitor-form.component';
import { Apuracao } from './models/apuracao';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'urna', component: UrnaComponent},
  { path: 'admin', component: PrincipalComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'candidatos', component: CandidatoListComponent },
    { path: 'candidatos/new', component: CandidatoFormComponent },
    { path: 'candidatos/edit/:id', component: CandidatoFormComponent },
    { path: 'eleitores', component: EleitorListComponent },
    { path: 'eleitores/new', component: EleitorFormComponent },
    { path: 'eleitores/edit/:id', component: EleitorFormComponent },
    { path: 'apuracao', component: Apuracao}
  ]}
];
