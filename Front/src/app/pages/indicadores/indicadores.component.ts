import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndicadoresService } from '../../services/indicadores.service';
import { EquiposService } from '../../services/equipos.service';

interface Estadistica {
  label: string;
  value: number;
  total?: number;
  percentage?: number;
  color: string;
}

interface MetricaCard {
  title: string;
  value: string | number;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  color: string;
}

@Component({
  selector: 'app-indicadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit {
  // Métricas principales
  metricas: MetricaCard[] = [];

  // Filtros de fecha
  fechaInicio: string = '';
  fechaFin: string = '';
  periodoSeleccionado: string = 'mes';

  // Estadísticas por tipo de mantenimiento
  estadisticasTipo: Estadistica[] = [];

  // Estadísticas por tipo de falla
  estadisticasFalla: Estadistica[] = [];

  // Equipos por estado
  equiposPorEstado: Estadistica[] = [];

  // Resumen de inventario
  inventarioResumen: any[] = [];

  // Tiempo fuera de servicio
  tiempoFueraServicio: any[] = [];
  maxTiempoFueraServicio: number = 0;

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  // Colores para los gráficos
  private colors = {
    tipo: {
      'Preventivo': '#3b82f6',
      'Correctivo': '#f59e0b',
      'Predictivo': '#8b5cf6',
      'Otro': '#6b7280'
    },
    falla: {
      'Falla de hardware': '#ef4444',
      'Falla de software': '#f59e0b',
      'Falla de red': '#3b82f6',
      'Falla eléctrica': '#8b5cf6',
      'Otro': '#6b7280'
    },
    estado: {
      'activo': '#10b981',
      'mantenimiento': '#f59e0b',
      'inactivo': '#ef4444'
    }
  };

  constructor(
    private indicadoresService: IndicadoresService,
    private equiposService: EquiposService
  ) {}

  ngOnInit() {
    this.setDefaultDateRange();
    this.loadDashboard();
  }

  /**
   * Establecer rango de fechas por defecto (último mes)
   */
  setDefaultDateRange() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.fechaFin = this.formatDate(hoy);
    this.fechaInicio = this.formatDate(hace30Dias);
  }

  /**
   * Formatear fecha a YYYY-MM-DD
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Cambiar período seleccionado
   */
  onPeriodoChange(periodo: string) {
    this.periodoSeleccionado = periodo;
    const hoy = new Date();
    const fechaInicio = new Date();

    switch (periodo) {
      case 'mes':
        fechaInicio.setMonth(hoy.getMonth() - 1);
        break;
      case 'trimestre':
        fechaInicio.setMonth(hoy.getMonth() - 3);
        break;
      case 'semestre':
        fechaInicio.setMonth(hoy.getMonth() - 6);
        break;
      case 'anio':
        fechaInicio.setFullYear(hoy.getFullYear() - 1);
        break;
    }

    this.fechaInicio = this.formatDate(fechaInicio);
    this.fechaFin = this.formatDate(hoy);
    this.loadDashboard();
  }

  /**
   * Aplicar filtro de fechas personalizado
   */
  aplicarFiltroFechas() {
    if (this.fechaInicio && this.fechaFin) {
      this.loadDashboard();
    }
  }

  /**
   * Cargar dashboard desde el backend
   */
  loadDashboard() {
    this.isLoading = true;
    this.error = null;

    this.indicadoresService.getDashboard(this.fechaInicio, this.fechaFin).subscribe({
      next: (response) => {
        if (response.success) {
          this.processDashboardData(response.data);
          this.loadEquiposStats();
          this.loadInventarioResumen();
        } else {
          this.error = 'Error al cargar los indicadores';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'Error al conectar con el servidor. Por favor, verifica que el backend esté ejecutándose.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Procesar datos del dashboard
   */
  processDashboardData(data: any) {
    // Procesar estadísticas por tipo
    if (data.estadisticasTipo && Array.isArray(data.estadisticasTipo)) {
      const totalTipo = data.estadisticasTipo.reduce((sum: number, item: any) => sum + parseInt(item.cantidad), 0);
      this.estadisticasTipo = data.estadisticasTipo.map((item: any) => ({
        label: item.tipo || 'Otro',
        value: parseInt(item.cantidad) || 0,
        total: totalTipo,
        percentage: totalTipo > 0 ? Math.round((parseInt(item.cantidad) / totalTipo) * 100) : 0,
        color: this.colors.tipo[item.tipo as keyof typeof this.colors.tipo] || '#6b7280'
      }));
    }

    // Procesar estadísticas por falla
    if (data.estadisticasFalla && Array.isArray(data.estadisticasFalla)) {
      this.estadisticasFalla = data.estadisticasFalla.map((item: any) => ({
        label: item.tipo_falla || 'Otro',
        value: parseInt(item.cantidad) || 0,
        color: this.colors.falla[item.tipo_falla as keyof typeof this.colors.falla] || '#6b7280'
      }));
    }

    // Procesar tiempo fuera de servicio
    if (data.tiempoFueraServicio && Array.isArray(data.tiempoFueraServicio)) {
      this.tiempoFueraServicio = data.tiempoFueraServicio.map((item: any) => ({
        mes: item.mes || item.fecha || 'N/A',
        horas: parseFloat(item.total_horas) || 0
      }));
      this.maxTiempoFueraServicio = Math.max(...this.tiempoFueraServicio.map(t => t.horas), 1);
    }

    // Calcular métricas principales
    this.calculateMetrics(data);
  }

  /**
   * Calcular métricas principales
   */
  calculateMetrics(data: any) {
    const totalMantenimientos = this.estadisticasTipo.reduce((sum, item) => sum + item.value, 0);
    const completados = this.estadisticasTipo.find(item => item.label === 'Correctivo')?.value || 0;

    this.metricas = [
      {
        title: 'Total Mantenimientos',
        value: totalMantenimientos,
        icon: '●',
        trend: 'neutral',
        trendValue: totalMantenimientos.toString(),
        color: '#3b82f6'
      },
      {
        title: 'Mantenimientos Preventivos',
        value: this.estadisticasTipo.find(item => item.label === 'Preventivo')?.value || 0,
        icon: '✓',
        trend: 'up',
        trendValue: `${this.estadisticasTipo.find(item => item.label === 'Preventivo')?.percentage || 0}%`,
        color: '#10b981'
      },
      {
        title: 'Mantenimientos Correctivos',
        value: this.estadisticasTipo.find(item => item.label === 'Correctivo')?.value || 0,
        icon: '!',
        trend: 'neutral',
        trendValue: `${this.estadisticasTipo.find(item => item.label === 'Correctivo')?.percentage || 0}%`,
        color: '#f59e0b'
      },
      {
        title: 'Total Horas Fuera Servicio',
        value: this.tiempoFueraServicio.reduce((sum, item) => sum + item.horas, 0).toFixed(1) + 'h',
        icon: '○',
        trend: 'down',
        trendValue: 'Últimos meses',
        color: '#8b5cf6'
      }
    ];
  }

  /**
   * Cargar estadísticas de equipos
   */
  loadEquiposStats() {
    this.equiposService.getEquipos().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const equipos = response.data;
          const totalEquipos = equipos.length;

          const activos = equipos.filter(e => e.activo === 1).length;
          const mantenimiento = 0; // No hay campo específico para mantenimiento en el nuevo modelo
          const inactivos = equipos.filter(e => e.activo === 0).length;

          this.equiposPorEstado = [
            {
              label: 'Activos',
              value: activos,
              total: totalEquipos,
              percentage: totalEquipos > 0 ? Math.round((activos / totalEquipos) * 100) : 0,
              color: this.colors.estado.activo
            },
            {
              label: 'En Mantenimiento',
              value: mantenimiento,
              total: totalEquipos,
              percentage: totalEquipos > 0 ? Math.round((mantenimiento / totalEquipos) * 100) : 0,
              color: this.colors.estado.mantenimiento
            },
            {
              label: 'Inactivos',
              value: inactivos,
              total: totalEquipos,
              percentage: totalEquipos > 0 ? Math.round((inactivos / totalEquipos) * 100) : 0,
              color: this.colors.estado.inactivo
            }
          ];
        }
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
      }
    });
  }

  /**
   * Cargar resumen de inventario por tipo
   */
  loadInventarioResumen() {
    // Incluir TODOS los equipos (incluso bodega e inactivos) para el resumen completo
    this.equiposService.getEquipos({ includeAll: true }).subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const equipos = response.data;
          const gruposPorTipo = new Map<string, any[]>();
          
          // Agrupar por tipo de equipo real (de la tabla tipoequipo)
          equipos.forEach(equipo => {
            // Usar el nombre del tipo de equipo de la relación, o 'Sin especificar' si no existe
            const tipo = (equipo as any).tipoEquipo?.nombres || 'Sin especificar';
            if (!gruposPorTipo.has(tipo)) {
              gruposPorTipo.set(tipo, []);
            }
            gruposPorTipo.get(tipo)!.push(equipo);
          });

          // Calcular estadísticas
          this.inventarioResumen = Array.from(gruposPorTipo.entries()).map(([tipo, equipos]) => ({
            tipo,
            total: equipos.length,
            activos: equipos.filter(e => Number(e.activo) === 1).length
          })).sort((a, b) => b.total - a.total).slice(0, 10); // Top 10
        }
      },
      error: (err) => {
        console.error('Error al cargar inventario:', err);
      }
    });
  }

  /**
   * Altura de la barra en el gráfico
   */
  getBarHeight(horas: number): string {
    return `${(horas / this.maxTiempoFueraServicio) * 100}%`;
  }

  /**
   * Icono de tendencia
   */
  getTrendIcon(trend: string): string {
    return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  }

  /**
   * Clase CSS de tendencia
   */
  getTrendClass(trend: string): string {
    return trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral';
  }
}
