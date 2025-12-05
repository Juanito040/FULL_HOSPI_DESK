import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  // Módulo Usuario
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios-control/usuarios-control.component').then(m => m.UsuariosControlComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'equipos',
    loadComponent: () => import('./pages/equipos/equipos.component').then(m => m.EquiposComponent),
    canActivate: [authGuard]
  },
  
  
  // Formatos
  {
    path: 'formatos/hv',
    loadComponent: () => import('./pages/formatos/formato-hv.component').then(m => m.FormatoHvComponent),
    canActivate: [authGuard]
  },
  {
    path: 'formatos/mph',
    loadComponent: () => import('./pages/formatos/formato-mph.component').then(m => m.FormatoMphComponent),
    canActivate: [authGuard]
  },
  {
    path: 'formatos/mp5',
    loadComponent: () => import('./pages/formatos/formato-mp5.component').then(m => m.FormatoMp5Component),
    canActivate: [authGuard]
  },
  {
    path: 'formatos/entrega',
    loadComponent: () => import('./pages/formatos/formato-entrega.component').then(m => m.FormatoEntregaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'formatos/correctivo',
    loadComponent: () => import('./pages/formatos/formato-correctivo.component').then(m => m.FormatoCorrectivoComponent),
    canActivate: [authGuard]
  },
  // Otros módulos
  {
    path: 'mantenimientos',
    loadComponent: () => import('./pages/mantenimientos/mantenimientos.component').then(m => m.MantenimientosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'indicadores',
    loadComponent: () => import('./pages/indicadores/indicadores.component').then(m => m.IndicadoresComponent),
    canActivate: [authGuard]
  },
  {
    path: 'backups',
    loadComponent: () => import('./pages/backups/backupsComponent/backups.component').then(m => m.BackupsComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Supervisor'] }
  },
  {
    path: 'newbackup',
    loadComponent: () => import('./pages/backups/newBackups/newbackup.component').then(m => m.NewBackupComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Supervisor'] }
  },
  {
    path: 'formatobackup/:id',
    loadComponent: () => import('./pages/backups/formatoBackups/formatobackup.component').then(m => m.FormatoBackupComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Supervisor'] }
  },
  {
    path: 'hojas-vida',
    loadComponent: () => import('./pages/hojas-vida/hojas-vida.component').then(m => m.HojasVidaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inventario',
    loadComponent: () => import('./pages/inventario/inventario.component').then(m => m.InventarioComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
