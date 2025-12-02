import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EquiposService } from '../../services/equipos.service';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { ActividadService, ActividadItem } from '../../services/actividad.service';
import { forkJoin } from 'rxjs';




interface Activity {
  type: string;
  description: string;
  time: string;
  icon: string;
  color?: string;
}

interface QuickAccess {
  title: string;
  iconClass: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  recentActivity: Activity[] = [];

  quickAccess: QuickAccess[] = [
    { title: 'Usuario', iconClass: 'fas fa-user', route: '/usuarios', color: '#667eea' },
    { title: 'Mantenimiento', iconClass: 'fas fa-tools', route: '/mantenimientos', color: '#f59e0b' },
    { title: 'Indicadores', iconClass: 'fas fa-chart-line', route: '/indicadores', color: '#10b981' },
    { title: 'Backups', iconClass: 'fas fa-database', route: '/backups', color: '#3b82f6' },
    { title: 'Inventario', iconClass: 'fas fa-boxes', route: '/inventario', color: '#8b5cf6' }
  ];

  // Banner de bienvenida
  currentTime: string = '';
  currentDate: string = '';
  greeting: string = '';
  userName: string = 'Administrador'; // TODO: Obtener del servicio de autenticación

  // Estados de carga
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private equiposService: EquiposService,
    private mantenimientosService: MantenimientosService,
    private actividadService: ActividadService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.updateDateTime();
    this.setGreeting();

    // Suscribirse a cambios de actividad
    this.actividadService.actividad$.subscribe((actividades) => {
      this.updateRecentActivityFromService(actividades);
    });

    // Actualizar la hora cada minuto
    setInterval(() => {
      this.updateDateTime();
    }, 60000);
  }

  /**
   * Actualizar fecha y hora actual
   */
  updateDateTime() {
    const now = new Date();

    // Formatear hora
    this.currentTime = now.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Formatear fecha
    this.currentDate = now.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Establecer saludo según la hora del día
   */
  setGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting = 'Buenos días';
    } else if (hour < 18) {
      this.greeting = 'Buenas tardes';
    } else {
      this.greeting = 'Buenas noches';
    }
  }

  /**
   * Cargar datos del dashboard
   */
  loadDashboardData() {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      equipos: this.equiposService.getEquipos(),
      mantenimientos: this.mantenimientosService.getMantenimientos()
    }).subscribe({
      next: (results) => {
        if (results.equipos.success && results.mantenimientos.success) {
          this.processData(results);
        } else {
          console.error('Error en respuesta:', results);
          this.error = 'Error al cargar los datos del dashboard';
          // Aún así mostrar datos vacíos
          this.processData(results);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'Error al conectar con el servidor';
        this.isLoading = false;
        // Mostrar actividad vacía
        this.recentActivity = [
          { type: 'info', description: 'No hay actividad reciente disponible', time: '', icon: 'fas fa-chart-bar' }
        ];
      }
    });
  }

  /**
   * Procesar datos recibidos
   */
  processData(results: any) {
    try {
      // Obtener mantenimientos con validación
      const mantenimientos = results.mantenimientos?.data 
        ? (Array.isArray(results.mantenimientos.data) ? results.mantenimientos.data : [results.mantenimientos.data])
        : [];

      if (mantenimientos.length === 0) {
        // Si no hay mantenimientos, dejar que la actividad del servicio maneje
        return;
      }

      // Convertir mantenimientos a formato de actividad
      const actividadesMantenimiento = mantenimientos
        .slice(0, 5)
        .map((m: any) => ({
          type: 'mantenimiento',
          action: 'completado' as const,
          description: `${m.tipo_mantenimiento || 'Mantenimiento'} - ${m.numero_reporte || 'N/A'}`,
          timestamp: m.fecha ? new Date(m.fecha) : new Date(),
          icon: m.estado === 'completado' ? 'fas fa-check-circle' : m.estado === 'en_proceso' ? 'fas fa-tools' : 'fas fa-calendar'
        } as ActividadItem));

      // Combinar con actividades del servicio
      this.actividadService.actividad$.subscribe((actividadesServicio) => {
        // Mezclar mantenimientos recientes con actividades del servicio
        const actividadesCombinadas = [...actividadesServicio, ...actividadesMantenimiento]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 8);
        
        this.updateRecentActivityFromService(actividadesCombinadas);
      });
    } catch (error) {
      console.error('Error al procesar datos:', error);
    }
  }

  /**
   * Actualizar actividad reciente desde el servicio
   */
  updateRecentActivityFromService(actividades: ActividadItem[]) {
    this.recentActivity = actividades.slice(0, 8).map((a) => {
      const ahora = new Date();
      const diffMs = ahora.getTime() - a.timestamp.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const diffMinutos = Math.floor(diffMs / (1000 * 60));

      let timeStr = '';
      if (diffDays > 0) {
        timeStr = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        timeStr = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      } else if (diffMinutos > 0) {
        timeStr = `Hace ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;
      } else {
        timeStr = 'Hace unos segundos';
      }

      return {
        type: a.type,
        description: a.description,
        time: timeStr,
        icon: a.icon,
        color: a.color
      };
    });

    if (this.recentActivity.length === 0) {
      this.recentActivity = [
        { type: 'info', description: 'No hay actividad reciente', time: '', icon: 'fas fa-chart-bar' }
      ];
    }
  }
}
