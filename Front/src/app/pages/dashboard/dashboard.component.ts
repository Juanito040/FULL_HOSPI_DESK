import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EquiposService } from '../../services/equipos.service';
import { MantenimientosService } from '../../services/mantenimientos.service';
import { forkJoin } from 'rxjs';

interface Activity {
  type: string;
  description: string;
  time: string;
  icon: string;
}

interface QuickAccess {
  title: string;
  icon: string;
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
    { title: 'Usuario', icon: '👤', route: '/usuarios', color: '#667eea' },
    { title: 'Mantenimiento', icon: '🔧', route: '/mantenimientos', color: '#f59e0b' },
    { title: 'Indicadores', icon: '📈', route: '/indicadores', color: '#10b981' },
    { title: 'Backups', icon: '💾', route: '/backups', color: '#3b82f6' },
    { title: 'Inventario', icon: '📦', route: '/inventario', color: '#8b5cf6' }
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
    private mantenimientosService: MantenimientosService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.updateDateTime();
    this.setGreeting();

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
          this.error = 'Error al cargar los datos del dashboard';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'Error al conectar con el servidor';
        this.isLoading = false;
      }
    });
  }

  /**
   * Procesar datos recibidos
   */
  processData(results: any) {
    const mantenimientos = Array.isArray(results.mantenimientos.data) ? results.mantenimientos.data : [results.mantenimientos.data];

    // Crear actividad reciente basada en mantenimientos recientes
    this.recentActivity = mantenimientos
      .slice(0, 8)
      .map((m: any) => {
        const fecha = m.fecha ? new Date(m.fecha + 'T00:00:00') : new Date();
        const ahora = new Date();
        const diffMs = ahora.getTime() - fecha.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        let timeStr = '';
        if (diffDays > 0) {
          timeStr = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
          timeStr = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        } else {
          timeStr = 'Hace unos minutos';
        }

        const estadoIcon = m.estado === 'completado' ? '✅' : m.estado === 'en_proceso' ? '🔧' : '📅';

        return {
          type: m.tipo_mantenimiento?.toLowerCase() || 'maintenance',
          description: `${m.tipo_mantenimiento || 'Mantenimiento'} - ${m.numero_reporte || 'N/A'}`,
          time: timeStr,
          icon: estadoIcon
        };
      });

    // Si no hay mantenimientos, mostrar mensaje placeholder
    if (this.recentActivity.length === 0) {
      this.recentActivity = [
        { type: 'info', description: 'No hay actividad reciente', time: '', icon: '📊' }
      ];
    }
  }
}
