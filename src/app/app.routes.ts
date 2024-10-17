import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { Routes } from '@angular/router';

export const routes: Routes = [ // Adicione o "export" aqui
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: PrincipalComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    // Adicione mais rotas filhas conforme necessário
  ]}
];