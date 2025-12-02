import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService, Usuario } from '../../services/usuarios.service';

interface Formato {
  nombre: string;
  ruta: string;
  iconoClase: string;
  descripcion: string;
}

@Component({
  selector: 'app-usuarios-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-control.component.html',
  styleUrls: ['./usuarios-control.component.css']
})
export class UsuariosControlComponent implements OnInit {
  activeTab: 'usuarios' | 'equipos' | 'formatos' = 'usuarios';
  usuarios: Usuario[] = [];
  loading = false;
  error: string | null = null;

  formatos: Formato[] = [
    {
      nombre: 'Hoja de Vida (HV)',
      ruta: '/formatos/hv',
      iconoClase: 'fas fa-file-invoice',
      descripcion: 'Formato de hoja de vida de equipos'
    },
    {
      nombre: 'Mantenimiento Preventivo Hardware (MPH)',
      ruta: '/formatos/mph',
      iconoClase: 'fas fa-tools',
      descripcion: 'Formato de mantenimiento preventivo de hardware'
    },
    {
      nombre: 'Mantenimiento Preventivo v5 (MP5)',
      ruta: '/formatos/mp5',
      iconoClase: 'fas fa-clipboard-check',
      descripcion: 'Formato de mantenimiento preventivo versión 5'
    },
    {
      nombre: 'Formato de Entrega',
      ruta: '/formatos/entrega',
      iconoClase: 'fas fa-box',
      descripcion: 'Formato de acta de entrega de equipos'
    },
    {
      nombre: 'Mantenimiento Correctivo',
      ruta: '/formatos/correctivo',
      iconoClase: 'fas fa-wrench',
      descripcion: 'Formato de mantenimiento correctivo'
    }
  ];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  setActiveTab(tab: 'usuarios' | 'equipos' | 'formatos'): void {
    this.activeTab = tab;
    if (tab === 'usuarios') {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = null;

    this.usuariosService.getUsuarios().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.usuarios = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar la lista de usuarios. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  obtenerEstadoTexto(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  obtenerClaseEstado(estado: number): string {
    return estado === 1 ? 'estado-activo' : 'estado-inactivo';
  }
}
