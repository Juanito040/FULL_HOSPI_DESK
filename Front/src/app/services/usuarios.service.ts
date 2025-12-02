import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  email: string;
  estado: number;
}

export interface UsuarioResponse {
  success: boolean;
  data: Usuario | Usuario[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los usuarios
   */
  getUsuarios(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(this.apiUrl);
  }

  /**
   * Obtener un usuario por ID
   */
  getUsuarioById(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener usuarios activos
   */
  getUsuariosActivos(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}?estado=1`);
  }
}
