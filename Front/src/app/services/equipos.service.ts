import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Equipo {
  id_sysequipo?: number;
  nombre_equipo: string;
  marca?: string;
  modelo?: string;
  serie?: string;
  placa_inventario?: string;
  codigo?: string;
  ubicacion?: string;
  ubicacion_especifica?: string;
  activo?: number; // 0 = inactivo, 1 = activo (TINYINT)
  ano_ingreso?: number;
  dias_mantenimiento?: number;
  periodicidad?: number;
  estado_baja?: number; // 0 = no, 1 = sí
  administrable?: number; // 0 = no, 1 = sí
  direccionamiento_Vlan?: string;
  numero_puertos?: number;
  mtto?: number; // 0 = no, 1 = sí
  id_hospital_fk?: number;
  id_servicio_fk?: number;
  id_tipo_equipo_fk?: number;
  id_usuario_fk?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipoResponse {
  success: boolean;
  data: Equipo | Equipo[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private apiUrl = `${environment.apiUrl}/sysequipo`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los equipos
   */
  getEquipos(filters?: {
    activo?: boolean;
    id_servicio_fk?: number;
    id_tipo_equipo_fk?: number;
    id_hospital_fk?: number;
    search?: string;
  }): Observable<EquipoResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.activo !== undefined) params = params.set('activo', filters.activo.toString());
      if (filters.id_servicio_fk) params = params.set('id_servicio_fk', filters.id_servicio_fk.toString());
      if (filters.id_tipo_equipo_fk) params = params.set('id_tipo_equipo_fk', filters.id_tipo_equipo_fk.toString());
      if (filters.id_hospital_fk) params = params.set('id_hospital_fk', filters.id_hospital_fk.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<EquipoResponse>(this.apiUrl, { params });
  }

  /**
   * Obtener un equipo por ID
   */
  getEquipoById(id: number): Observable<EquipoResponse> {
    return this.http.get<EquipoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo equipo
   */
  createEquipo(equipo: Equipo): Observable<EquipoResponse> {
    return this.http.post<EquipoResponse>(this.apiUrl, equipo);
  }

  /**
   * Actualizar un equipo existente
   */
  updateEquipo(id: number, equipo: Partial<Equipo>): Observable<EquipoResponse> {
    return this.http.put<EquipoResponse>(`${this.apiUrl}/${id}`, equipo);
  }

  /**
   * Enviar un equipo a bodega (soft delete con motivo)
   */
  enviarABodega(id: number, motivo?: string): Observable<EquipoResponse> {
    return this.http.delete<EquipoResponse>(`${this.apiUrl}/${id}`, {
      body: { motivo }
    });
  }

  /**
   * Dar de baja un equipo permanentemente
   */
  darDeBaja(id: number, data: {
    justificacion_baja: string;
    accesorios_reutilizables?: string;
    id_usuario?: number;
  }): Observable<EquipoResponse> {
    return this.http.post<EquipoResponse>(`${this.apiUrl}/${id}/hard-delete`, data);
  }

  /**
   * Obtener equipos en bodega
   */
  getEquiposEnBodega(): Observable<EquipoResponse> {
    return this.http.get<EquipoResponse>(`${this.apiUrl}/bodega`);
  }

  /**
   * Obtener equipos dados de baja
   */
  getEquiposDadosDeBaja(): Observable<EquipoResponse> {
    return this.http.get<EquipoResponse>(`${this.apiUrl}/dados-baja`);
  }

  /**
   * Eliminar un equipo (soft delete - inactivar)
   * @deprecated Usar enviarABodega o darDeBaja según el caso
   */
  deleteEquipo(id: number): Observable<EquipoResponse> {
    return this.http.delete<EquipoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Eliminar un equipo permanentemente (hard delete)
   * @deprecated Usar darDeBaja en su lugar
   */
  hardDeleteEquipo(id: number, password: string): Observable<EquipoResponse> {
    return this.http.post<EquipoResponse>(`${this.apiUrl}/${id}/hard-delete`, { password });
  }

  /**
   * Buscar equipos por término de búsqueda
   */
  searchEquipos(searchTerm: string): Observable<EquipoResponse> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<EquipoResponse>(this.apiUrl, { params });
  }
}
