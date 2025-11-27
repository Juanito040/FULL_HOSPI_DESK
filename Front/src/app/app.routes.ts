import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  // Módulo Usuario
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'equipos',
    loadComponent: () => import('./pages/equipos/equipos.component').then(m => m.EquiposComponent)
  },
  // Formatos
  {
    path: 'formatos/hv',
    loadComponent: () => import('./pages/formatos/formato-hv.component').then(m => m.FormatoHvComponent)
  },
  {
    path: 'formatos/mph',
    loadComponent: () => import('./pages/formatos/formato-mph.component').then(m => m.FormatoMphComponent)
  },
  {
    path: 'formatos/mp5',
    loadComponent: () => import('./pages/formatos/formato-mp5.component').then(m => m.FormatoMp5Component)
  },
  {
    path: 'formatos/entrega',
    loadComponent: () => import('./pages/formatos/formato-entrega.component').then(m => m.FormatoEntregaComponent)
  },
  {
    path: 'formatos/correctivo',
    loadComponent: () => import('./pages/formatos/formato-correctivo.component').then(m => m.FormatoCorrectivoComponent)
  },
  // Otros módulos
  {
    path: 'mantenimientos',
    loadComponent: () => import('./pages/mantenimientos/mantenimientos.component').then(m => m.MantenimientosComponent)
  },
  {
    path: 'indicadores',
    loadComponent: () => import('./pages/indicadores/indicadores.component').then(m => m.IndicadoresComponent)
  },
  {
    path: 'backups',
    loadComponent: () => import('./pages/backups/backups.component').then(m => m.BackupsComponent)
  },
  {
    path: 'inventario',
    loadComponent: () => import('./pages/inventario/inventario.component').then(m => m.InventarioComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
