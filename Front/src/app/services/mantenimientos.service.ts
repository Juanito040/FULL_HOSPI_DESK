import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Mantenimiento {
  id_sysmtto?: number;
  numero_reporte?: string;
  fecha?: string;
  hora_llamado?: string;
  hora_inicio?: string;
  hora_terminacion?: string;
  // Cambio de ENUM a INT
  tipo_mantenimiento?: number; // 1=Correctivo, 2=Preventivo, 3=Predictivo, 4=Otro
  tipo_falla?: number; // 1=Desgaste, 2=Operación Indebida, 3=Causa Externa, 4=Accesorios, 5=Desconocido, 6=Sin Falla, 7=Otros, 8=No Registra
  // Cambio de string a boolean
  mphardware?: boolean;
  mpsoftware?: boolean;
  dano?: boolean;
  entega?: boolean;
  // Campos de texto
  rutinah?: string;
  rutinas?: string;
  observacionesh?: string;
  observacioness?: string;
  autor_realizado?: string;
  autor_recibido?: string;
  tiempo_fuera_servicio?: number;
  // Rutas de archivos
  rutahardware?: string;
  rutasoftware?: string;
  rutaentrega?: string;
  // Foreign keys
  id_sysequipo_fk?: number;
  id_sysusuario_fk?: number;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface MantenimientoResponse {
  success: boolean;
  data: Mantenimiento | Mantenimiento[];
  message?: string;
}

export interface DashboardData {
  estadisticasTipo: any[];
  estadisticasFalla: any[];
  tiempoFueraServicio: any[];
  mantenimientosPorTecnico: any[];
  equiposConMasMantenimientos: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {
  private apiUrl = `${environment.apiUrl}/sysmantenimiento`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los mantenimientos
   */
  getMantenimientos(filters?: {
    tipo_mantenimiento?: number;
    tipo_falla?: number;
    id_equipo?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Observable<MantenimientoResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.tipo_mantenimiento) params = params.set('tipo_mantenimiento', filters.tipo_mantenimiento.toString());
      if (filters.tipo_falla) params = params.set('tipo_falla', filters.tipo_falla.toString());
      if (filters.id_equipo) params = params.set('id_equipo', filters.id_equipo.toString());
      if (filters.fecha_inicio) params = params.set('fecha_inicio', filters.fecha_inicio);
      if (filters.fecha_fin) params = params.set('fecha_fin', filters.fecha_fin);
    }

    return this.http.get<MantenimientoResponse>(this.apiUrl, { params });
  }

  /**
   * Obtener un mantenimiento por ID
   */
  getMantenimientoById(id: number): Observable<MantenimientoResponse> {
    return this.http.get<MantenimientoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener mantenimientos por equipo
   */
  getMantenimientosByEquipo(equipoId: number): Observable<MantenimientoResponse> {
    return this.http.get<MantenimientoResponse>(`${this.apiUrl}/equipo/${equipoId}`);
  }

  /**
   * Obtener mantenimientos por técnico
   */
  getMantenimientosByTecnico(tecnicoId: number): Observable<MantenimientoResponse> {
    return this.http.get<MantenimientoResponse>(`${this.apiUrl}/tecnico/${tecnicoId}`);
  }

  /**
   * Crear un nuevo mantenimiento
   */
  createMantenimiento(mantenimiento: Mantenimiento): Observable<MantenimientoResponse> {
    return this.http.post<MantenimientoResponse>(this.apiUrl, mantenimiento);
  }

  /**
   * Actualizar un mantenimiento existente
   */
  updateMantenimiento(id: number, mantenimiento: Partial<Mantenimiento>): Observable<MantenimientoResponse> {
    return this.http.put<MantenimientoResponse>(`${this.apiUrl}/${id}`, mantenimiento);
  }

  /**
   * Eliminar un mantenimiento
   */
  deleteMantenimiento(id: number): Observable<MantenimientoResponse> {
    return this.http.delete<MantenimientoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener dashboard con estadísticas
   */
  getDashboard(fechaInicio?: string, fechaFin?: string): Observable<{ success: boolean; data: DashboardData }> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get<{ success: boolean; data: DashboardData }>(`${this.apiUrl}/dashboard`, { params });
  }

  /**
   * Obtener estadísticas por tipo de mantenimiento
   */
  getEstadisticasPorTipo(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get(`${this.apiUrl}/estadisticas/tipo`, { params });
  }

  /**
   * Obtener estadísticas por tipo de falla
   */
  getEstadisticasPorFalla(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get(`${this.apiUrl}/estadisticas/falla`, { params });
  }

  /**
   * Obtener tiempo fuera de servicio
   */
  getTiempoFueraServicio(fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);

    return this.http.get(`${this.apiUrl}/estadisticas/tiempo-fuera-servicio`, { params });
  }
}
