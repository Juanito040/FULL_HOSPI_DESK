import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  email: string;
  estado: number;
  rolId: number;
  rol: {
    id: number;
    nombre: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: Usuario;
    token: string;
  };
}

export interface RegisterData {
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  tipoId: string;
  numeroId: string;
  telefono: string;
  email: string;
  contraseña: string;
  registroInvima: string;
  rolId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  public isAuthenticated = signal<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // No verificar token automáticamente para evitar logout inesperado
    // La verificación se hará cuando sea necesario
  }

  login(nombreUsuario: string, contraseña: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      nombreUsuario,
      contraseña
    }).pipe(
      tap(response => {
        if (response.success) {
          this.setSession(response.data);
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  hasRole(roles: string | string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.rol) {
      return false;
    }

    const userRole = user.rol.nombre;
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  }

  isAdmin(): boolean {
    return this.hasRole('Administrador');
  }

  verifyToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    return this.http.get(`${this.apiUrl}/verify`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
          this.isAuthenticated.set(true);
        }
      }),
      catchError(error => {
        // No hacer logout automático aquí
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
          this.saveUserToStorage(response.data);
        }
      })
    );
  }

  changePassword(contraseñaActual: string, contraseñaNueva: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      contraseñaActual,
      contraseñaNueva
    });
  }

  private setSession(authResult: { user: Usuario; token: string }): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    this.saveUserToStorage(authResult.user);
    this.currentUserSubject.next(authResult.user);
    this.isAuthenticated.set(true);
  }

  private saveUserToStorage(user: Usuario): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getUserFromStorage(): Usuario | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private checkTokenValidity(): void {
    const token = this.getToken();
    if (token) {
      this.verifyToken().subscribe({
        next: () => {
          this.isAuthenticated.set(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }
}
