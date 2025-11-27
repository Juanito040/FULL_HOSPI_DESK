import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Estadistica {
  tipo?: string;
  tipo_falla?: string;
  cantidad: number;
  porcentaje?: number;
}

export interface TiempoFueraServicio {
  fecha?: string;
  mes?: string;
  total_horas: number;
  cantidad_mantenimientos?: number;
}

export interface MantenimientoPorTecnico {
  nombre_tecnico: string;
  total_mantenimientos: number;
}

export interface EquipoConMasMantenimientos {
  nombre_equipo: string;
  total_mantenimientos: number;
}

export interface DashboardIndicadores {
  estadisticasTipo: Estadistica[];
  estadisticasFalla: Estadistica[];
  tiempoFueraServicio: TiempoFueraServicio[];
  mantenimientosPorTecnico: MantenimientoPorTecnico[];
  equiposConMasMantenimientos: EquipoConMasMantenimientos[];
}

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private apiUrl = `${environment.apiUrl}/sysmantenimiento`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener dashboard completo de indicadores
   */
  getDashboard(fechaInicio?: string, fechaFin?: string): Observable<{ success: boolean; data: DashboardIndicadores }> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get<{ success: boolean; data: DashboardIndicadores }>(`${this.apiUrl}/dashboard`, { params });
  }

  /**
   * Obtener estadísticas por tipo de mantenimiento
   */
  getEstadisticasPorTipo(fechaInicio?: string, fechaFin?: string): Observable<{ success: boolean; data: Estadistica[] }> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get<{ success: boolean; data: Estadistica[] }>(`${this.apiUrl}/estadisticas/tipo`, { params });
  }

  /**
   * Obtener estadísticas por tipo de falla
   */
  getEstadisticasPorFalla(fechaInicio?: string, fechaFin?: string): Observable<{ success: boolean; data: Estadistica[] }> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get<{ success: boolean; data: Estadistica[] }>(`${this.apiUrl}/estadisticas/falla`, { params });
  }

  /**
   * Obtener tiempo fuera de servicio
   */
  getTiempoFueraServicio(fechaInicio?: string, fechaFin?: string): Observable<{ success: boolean; data: TiempoFueraServicio[] }> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get<{ success: boolean; data: TiempoFueraServicio[] }>(`${this.apiUrl}/estadisticas/tiempo-fuera-servicio`, { params });
  }

  /**
   * Calcular disponibilidad de equipos
   * @param totalEquipos Total de equipos registrados
   * @param equiposActivos Equipos actualmente activos
   */
  calcularDisponibilidad(totalEquipos: number, equiposActivos: number): number {
    if (totalEquipos === 0) return 0;
    return (equiposActivos / totalEquipos) * 100;
  }

  /**
   * Calcular tiempo promedio de respuesta
   * @param tiempos Array de tiempos en horas
   */
  calcularTiempoPromedioRespuesta(tiempos: number[]): number {
    if (tiempos.length === 0) return 0;
    const suma = tiempos.reduce((acc, tiempo) => acc + tiempo, 0);
    return suma / tiempos.length;
  }

  /**
   * Calcular tasa de primer arreglo
   * @param totalMantenimientos Total de mantenimientos
   * @param mantenimientosExitosos Mantenimientos resueltos en primer intento
   */
  calcularTasaPrimerArreglo(totalMantenimientos: number, mantenimientosExitosos: number): number {
    if (totalMantenimientos === 0) return 0;
    return (mantenimientosExitosos / totalMantenimientos) * 100;
  }

  /**
   * Obtener métricas principales
   */
  getMetricasPrincipales(fechaInicio?: string, fechaFin?: string): Observable<any> {
    // Esta función puede ser extendida cuando el backend provea un endpoint específico
    // Por ahora, usamos el dashboard que ya tiene toda la información
    return this.getDashboard(fechaInicio, fechaFin);
  }
}
