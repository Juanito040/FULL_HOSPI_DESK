import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CatalogoItem, getAllTiposMantenimiento, getAllTiposFalla } from '../utils/sys-constants';

export interface CatalogosResponse {
  success: boolean;
  data: CatalogoItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SysCatalogosService {
  private apiUrl = `${environment.apiUrl}/sysmantenimiento/catalogos`;

  // Cache para los catálogos
  private tiposMantenimientoCache$?: Observable<CatalogoItem[]>;
  private tiposFallaCache$?: Observable<CatalogoItem[]>;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el catálogo de tipos de mantenimiento desde el backend
   * Con caché para evitar múltiples llamadas
   */
  getTiposMantenimiento(useCache: boolean = true): Observable<CatalogoItem[]> {
    if (useCache && this.tiposMantenimientoCache$) {
      return this.tiposMantenimientoCache$;
    }

    this.tiposMantenimientoCache$ = this.http.get<CatalogosResponse>(`${this.apiUrl}/tipos-mantenimiento`)
      .pipe(
        map(response => response.data),
        shareReplay(1) // Cachear el resultado
      );

    return this.tiposMantenimientoCache$;
  }

  /**
   * Obtiene el catálogo de tipos de falla desde el backend
   * Con caché para evitar múltiples llamadas
   */
  getTiposFalla(useCache: boolean = true): Observable<CatalogoItem[]> {
    if (useCache && this.tiposFallaCache$) {
      return this.tiposFallaCache$;
    }

    this.tiposFallaCache$ = this.http.get<CatalogosResponse>(`${this.apiUrl}/tipos-falla`)
      .pipe(
        map(response => response.data),
        shareReplay(1) // Cachear el resultado
      );

    return this.tiposFallaCache$;
  }

  /**
   * Obtiene el catálogo de tipos de mantenimiento desde constantes locales
   * Útil para fallback si el backend no está disponible
   */
  getTiposMantenimientoLocal(): CatalogoItem[] {
    return getAllTiposMantenimiento();
  }

  /**
   * Obtiene el catálogo de tipos de falla desde constantes locales
   * Útil para fallback si el backend no está disponible
   */
  getTiposFallaLocal(): CatalogoItem[] {
    return getAllTiposFalla();
  }

  /**
   * Limpia el caché de catálogos
   * Útil cuando se necesita refrescar los datos
   */
  clearCache(): void {
    this.tiposMantenimientoCache$ = undefined;
    this.tiposFallaCache$ = undefined;
  }

  /**
   * Obtiene todos los catálogos en una sola llamada
   */
  getAllCatalogos(): Observable<{
    tiposMantenimiento: CatalogoItem[],
    tiposFalla: CatalogoItem[]
  }> {
    return new Observable(observer => {
      const tiposMantenimiento: CatalogoItem[] = [];
      const tiposFalla: CatalogoItem[] = [];
      let completed = 0;

      this.getTiposMantenimiento().subscribe({
        next: (data) => {
          tiposMantenimiento.push(...data);
          completed++;
          if (completed === 2) {
            observer.next({ tiposMantenimiento, tiposFalla });
            observer.complete();
          }
        },
        error: (err) => observer.error(err)
      });

      this.getTiposFalla().subscribe({
        next: (data) => {
          tiposFalla.push(...data);
          completed++;
          if (completed === 2) {
            observer.next({ tiposMantenimiento, tiposFalla });
            observer.complete();
          }
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
