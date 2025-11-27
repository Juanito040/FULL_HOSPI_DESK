import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HojaVida {
  id_syshoja_vida?: number;
  ip?: string;
  mac?: string;
  procesador?: string;
  ram?: string;
  disco_duro?: string;
  sistema_operativo?: string;
  office?: string;
  tonner?: string;
  nombre_usuario?: string;
  vendedor?: string;
  tipo_uso?: string;
  fecha_compra?: Date | string;
  fecha_instalacion?: Date | string;
  costo_compra?: number;
  contrato?: string;
  observaciones?: string;
  foto?: string;
  compraddirecta?: boolean;
  convenio?: boolean;
  donado?: boolean;
  comodato?: boolean;
  id_sysequipo_fk?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HojaVidaResponse {
  success: boolean;
  data: HojaVida | HojaVida[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HojasVidaService {
  private apiUrl = `${environment.apiUrl}/syshojavida`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las hojas de vida
   */
  getHojasVida(filters?: {
    id_sysequipo_fk?: number;
    search?: string;
  }): Observable<HojaVidaResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.id_sysequipo_fk) params = params.set('id_sysequipo_fk', filters.id_sysequipo_fk.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<HojaVidaResponse>(this.apiUrl, { params });
  }

  /**
   * Obtener una hoja de vida por ID
   */
  getHojaVidaById(id: number): Observable<HojaVidaResponse> {
    return this.http.get<HojaVidaResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener hoja de vida por ID de equipo
   */
  getHojaVidaByEquipoId(equipoId: number): Observable<HojaVidaResponse> {
    return this.http.get<HojaVidaResponse>(`${this.apiUrl}/equipo/${equipoId}`);
  }

  /**
   * Crear una nueva hoja de vida
   */
  createHojaVida(hojaVida: HojaVida): Observable<HojaVidaResponse> {
    return this.http.post<HojaVidaResponse>(this.apiUrl, hojaVida);
  }

  /**
   * Actualizar una hoja de vida existente
   */
  updateHojaVida(id: number, hojaVida: Partial<HojaVida>): Observable<HojaVidaResponse> {
    return this.http.put<HojaVidaResponse>(`${this.apiUrl}/${id}`, hojaVida);
  }

  /**
   * Eliminar una hoja de vida
   */
  deleteHojaVida(id: number): Observable<HojaVidaResponse> {
    return this.http.delete<HojaVidaResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar hojas de vida por término de búsqueda
   */
  searchHojasVida(searchTerm: string): Observable<HojaVidaResponse> {
    const params = new HttpParams().set('q', searchTerm);
    return this.http.get<HojaVidaResponse>(`${this.apiUrl}/search`, { params });
  }
}
