import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Backup {
  id_reporte_backup?: number;
  nombre_recurso: string;
  tipo_recurso: 'Servidor virtual' | 'Servidor fisico' | 'Base de datos' | 'Computador' | 'Correo' | 'Switch' | 'TRD' | 'Otro';
  destino?: string;
  medio: 'Cinta' | 'Disco' | 'Servidor';
  periodicidad: 'Diario' | 'Semanal' | 'Mensual';
  fecha_backup?: string;
  tamano?: string;
  autor_solicita?: string;
  numero_caso_ms?: string;
  caso_ms: 'Si' | 'No';
  observaciones?: string;
  id_autor_realizado_fk?: number;
  createdAt?: string;
  updatedAt?: string;
  autorRealizado?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
}

export interface BackupResponse {
  success: boolean;
  message?: string;
  data?: Backup | Backup[];
  count?: number;
}

export interface BackupPendiente {
  id_reporte_backup: number;
  nombre_recurso: string;
  periodicidad: string;
  destino: string;
  faltantes: string[];
  ultimo_backup: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackupsService {
  private apiUrl = `${environment.apiUrl}/backup`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los backups
   */
  getBackups(): Observable<BackupResponse> {
    return this.http.get<BackupResponse>(this.apiUrl);
  }

  /**
   * Obtener un backup por ID
   */
  getBackupById(id: number): Observable<BackupResponse> {
    return this.http.get<BackupResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener backups por usuario
   */
  getBackupsPorUsuario(usuarioId: number): Observable<BackupResponse> {
    return this.http.get<BackupResponse>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /**
   * Obtener backups por rango de fechas
   */
  getBackupsPorRango(inicio: string, fin: string, limit: number = 100, offset: number = 0): Observable<BackupResponse> {
    let params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin)
      .set('limit', limit.toString())
      .set('offset', offset.toString());
    
    return this.http.get<BackupResponse>(`${this.apiUrl}/rango`, { params });
  }

  /**
   * Obtener backups pendientes
   */
  getBackupsPendientes(): Observable<{ success: boolean; data: BackupPendiente[]; count?: number; message?: string }> {
    return this.http.get<{ success: boolean; data: BackupPendiente[]; count?: number; message?: string }>(`${this.apiUrl}/pendientes`);
  }

  /**
   * Obtener detalles de backups pendientes por ID
   */
  getBackupsPendientesDetalle(id: number): Observable<{ success: boolean; data: any }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/pendientes/${id}`);
  }

  /**
   * Crear un nuevo backup
   */
  createBackup(backup: Backup): Observable<BackupResponse> {
    return this.http.post<BackupResponse>(this.apiUrl, backup);
  }

  /**
   * Actualizar un backup
   */
  updateBackup(id: number, backup: Partial<Backup>): Observable<BackupResponse> {
    return this.http.put<BackupResponse>(`${this.apiUrl}/${id}`, backup);
  }

  /**
   * Eliminar un backup
   */
  deleteBackup(id: number): Observable<BackupResponse> {
    return this.http.delete<BackupResponse>(`${this.apiUrl}/${id}`);
  }
}
