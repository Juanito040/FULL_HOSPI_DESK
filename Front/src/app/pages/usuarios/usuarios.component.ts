import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Formato {
  nombre: string;
  ruta: string;
  icono: string;
  descripcion: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  activeTab: 'usuarios' | 'equipos' | 'formatos' = 'usuarios';

  formatos: Formato[] = [
    {
      nombre: 'Hoja de Vida (HV)',
      ruta: '/formatos/hv',
      icono: '📋',
      descripcion: 'Formato de hoja de vida de equipos'
    },
    {
      nombre: 'Mantenimiento Preventivo Hardware (MPH)',
      ruta: '/formatos/mph',
      icono: '🔧',
      descripcion: 'Formato de mantenimiento preventivo de hardware'
    },
    {
      nombre: 'Mantenimiento Preventivo v5 (MP5)',
      ruta: '/formatos/mp5',
      icono: '📝',
      descripcion: 'Formato de mantenimiento preventivo versión 5'
    },
    {
      nombre: 'Formato de Entrega',
      ruta: '/formatos/entrega',
      icono: '📦',
      descripcion: 'Formato de acta de entrega de equipos'
    },
    {
      nombre: 'Mantenimiento Correctivo',
      ruta: '/formatos/correctivo',
      icono: '⚙️',
      descripcion: 'Formato de mantenimiento correctivo'
    }
  ];

  setActiveTab(tab: 'usuarios' | 'equipos' | 'formatos') {
    this.activeTab = tab;
  }
}
