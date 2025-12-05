import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los backups
  getBackups(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backups`);
  }

  // Obtener un backup por ID
  getBackupById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backups/${id}`);
  }

  // Crear backup
  createBackup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/backup`, data);
  }

  // Eliminar backup
  deleteBackup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/backup/${id}`);
  }

  // Backups por usuario
  getBackupsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backup/usuario/${userId}`);
  }

  // Backups por rango
  getBackupsByRange(inicio: string, fin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backup/rango?inicio=${inicio}&fin=${fin}`);
  }

  // Pendientes
  getPendingBackups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/backup/pendientes`);
  }

  getPendingBackupsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backup/pendientes/${id}`);
  }
}
