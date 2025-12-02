import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ActividadItem {
  type: 'equipo' | 'mantenimiento' | 'usuario' | 'backup' | 'reporte' | 'indicador' | 'info' | 'sistema' | 'hoja-vida';
  action: 'creado' | 'actualizado' | 'eliminado' | 'completado' | 'generado' | 'exportado' | 'restaurado' | 'login' | 'logout';
  description: string;
  timestamp: Date;
  icon: string;
  color?: string; // Color opcional para diferenciar visualmente
}

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private actividadSubject = new BehaviorSubject<ActividadItem[]>([]);
  public actividad$ = this.actividadSubject.asObservable();

  private maxActividades = 20; // Máximo de actividades en memoria

  constructor() {
    // Cargar actividades del localStorage
    this.loadActividadesFromStorage();
  }

  /**
   * Registrar una nueva actividad
   */
  registrarActividad(item: ActividadItem) {
    const actividades = this.actividadSubject.value;
    const nuevaActividad: ActividadItem = {
      ...item,
      timestamp: new Date()
    };

    // Agregar al inicio del array
    const actividadesActualizadas = [nuevaActividad, ...actividades].slice(0, this.maxActividades);
    this.actividadSubject.next(actividadesActualizadas);

    // Guardar en localStorage
    this.saveActividadesToStorage(actividadesActualizadas);
  }

  /**
   * Registrar creación de equipo
   */
  equipoCreado(nombreEquipo: string, marca?: string, modelo?: string) {
    const description = `Equipo creado: ${nombreEquipo}${marca ? ` (${marca})` : ''}`;
    this.registrarActividad({
      type: 'equipo',
      action: 'creado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-plus-circle',
      color: '#10b981' // Verde
    });
  }

  /**
   * Registrar actualización de equipo
   */
  equipoActualizado(nombreEquipo: string) {
    const description = `Equipo actualizado: ${nombreEquipo}`;
    this.registrarActividad({
      type: 'equipo',
      action: 'actualizado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-edit',
      color: '#3b82f6' // Azul
    });
  }

  /**
   * Registrar inactivación de equipo
   */
  equipoInactivado(nombreEquipo: string) {
    const description = `Equipo inactivado: ${nombreEquipo}`;
    this.registrarActividad({
      type: 'equipo',
      action: 'actualizado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-pause-circle',
      color: '#f59e0b' // Naranja
    });
  }

  /**
   * Registrar eliminación de equipo
   */
  equipoEliminado(nombreEquipo: string) {
    const description = `Equipo eliminado permanentemente: ${nombreEquipo}`;
    this.registrarActividad({
      type: 'equipo',
      action: 'eliminado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-trash-alt',
      color: '#ef4444' // Rojo
    });
  }

  /**
   * Registrar mantenimiento completado
   */
  mantenimientoCompletado(numeroReporte: string, tipo: string) {
    const description = `Mantenimiento completado: ${tipo} - ${numeroReporte}`;
    this.registrarActividad({
      type: 'mantenimiento',
      action: 'completado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-check-circle',
      color: '#10b981' // Verde
    });
  }

  /**
   * Registrar creación de mantenimiento
   */
  mantenimientoCreado(numeroReporte: string, tipo: string) {
    const description = `Mantenimiento creado: ${tipo} - ${numeroReporte}`;
    this.registrarActividad({
      type: 'mantenimiento',
      action: 'creado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-tools',
      color: '#f59e0b' // Naranja
    });
  }

  /**
   * Registrar actualización de mantenimiento
   */
  mantenimientoActualizado(numeroReporte: string) {
    const description = `Mantenimiento actualizado: ${numeroReporte}`;
    this.registrarActividad({
      type: 'mantenimiento',
      action: 'actualizado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-wrench',
      color: '#3b82f6' // Azul
    });
  }

  /**
   * Registrar eliminación de mantenimiento
   */
  mantenimientoEliminado(numeroReporte: string) {
    const description = `Mantenimiento eliminado: ${numeroReporte}`;
    this.registrarActividad({
      type: 'mantenimiento',
      action: 'eliminado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-trash-alt',
      color: '#ef4444' // Rojo
    });
  }

  /**
   * Registrar creación de usuario
   */
  usuarioCreado(nombreUsuario: string) {
    const description = `Usuario creado: ${nombreUsuario}`;
    this.registrarActividad({
      type: 'usuario',
      action: 'creado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-user-plus',
      color: '#8b5cf6' // Púrpura
    });
  }

  /**
   * Registrar actualización de usuario
   */
  usuarioActualizado(nombreUsuario: string) {
    const description = `Usuario actualizado: ${nombreUsuario}`;
    this.registrarActividad({
      type: 'usuario',
      action: 'actualizado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-user-edit',
      color: '#3b82f6' // Azul
    });
  }

  /**
   * Registrar eliminación de usuario
   */
  usuarioEliminado(nombreUsuario: string) {
    const description = `Usuario eliminado: ${nombreUsuario}`;
    this.registrarActividad({
      type: 'usuario',
      action: 'eliminado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-user-times',
      color: '#ef4444' // Rojo
    });
  }

  /**
   * Registrar backup generado
   */
  backupGenerado(nombreBackup: string) {
    const description = `Backup generado: ${nombreBackup}`;
    this.registrarActividad({
      type: 'backup',
      action: 'generado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-database',
      color: '#06b6d4' // Cian
    });
  }

  /**
   * Registrar backup restaurado
   */
  backupRestaurado(nombreBackup: string) {
    const description = `Backup restaurado: ${nombreBackup}`;
    this.registrarActividad({
      type: 'backup',
      action: 'restaurado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-undo',
      color: '#10b981' // Verde
    });
  }

  /**
   * Registrar reporte generado
   */
  reporteGenerado(tipoReporte: string) {
    const description = `Reporte generado: ${tipoReporte}`;
    this.registrarActividad({
      type: 'reporte',
      action: 'generado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-file-alt',
      color: '#6366f1' // Índigo
    });
  }

  /**
   * Registrar reporte exportado
   */
  reporteExportado(tipoReporte: string, formato: string) {
    const description = `Reporte exportado: ${tipoReporte} (${formato})`;
    this.registrarActividad({
      type: 'reporte',
      action: 'exportado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-file-export',
      color: '#8b5cf6' // Púrpura
    });
  }

  /**
   * Registrar indicador actualizado
   */
  indicadorActualizado(nombreIndicador: string) {
    const description = `Indicador actualizado: ${nombreIndicador}`;
    this.registrarActividad({
      type: 'indicador',
      action: 'actualizado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-chart-line',
      color: '#10b981' // Verde
    });
  }

  /**
   * Registrar login de usuario
   */
  usuarioLogin(nombreUsuario: string) {
    const description = `${nombreUsuario} ha iniciado sesión`;
    this.registrarActividad({
      type: 'sistema',
      action: 'login',
      description,
      timestamp: new Date(),
      icon: 'fas fa-sign-in-alt',
      color: '#10b981' // Verde
    });
  }

  /**
   * Registrar logout de usuario
   */
  usuarioLogout(nombreUsuario: string) {
    const description = `${nombreUsuario} ha cerrado sesión`;
    this.registrarActividad({
      type: 'sistema',
      action: 'logout',
      description,
      timestamp: new Date(),
      icon: 'fas fa-sign-out-alt',
      color: '#6b7280' // Gris
    });
  }

  /**
   * Registrar creación de hoja de vida
   */
  hojaVidaCreada(nombreEquipo: string) {
    const description = `Hoja de vida creada para: ${nombreEquipo}`;
    this.registrarActividad({
      type: 'hoja-vida',
      action: 'creado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-file-medical',
      color: '#14b8a6' // Teal
    });
  }

  /**
   * Registrar actualización de hoja de vida
   */
  hojaVidaActualizada(nombreEquipo: string) {
    const description = `Hoja de vida actualizada: ${nombreEquipo}`;
    this.registrarActividad({
      type: 'hoja-vida',
      action: 'actualizado',
      description,
      timestamp: new Date(),
      icon: 'fas fa-file-medical-alt',
      color: '#06b6d4' // Cian
    });
  }

  /**
   * Obtener actividades recientes
   */
  getActividadesRecientes(limite: number = 8): Observable<ActividadItem[]> {
    return this.actividad$;
  }

  /**
   * Guardar actividades en localStorage
   */
  private saveActividadesToStorage(actividades: ActividadItem[]) {
    try {
      const actividadesSerialized = actividades.map(a => ({
        ...a,
        timestamp: a.timestamp.toISOString()
      }));
      localStorage.setItem('actividades', JSON.stringify(actividadesSerialized));
    } catch (error) {
      console.error('Error al guardar actividades:', error);
    }
  }

  /**
   * Cargar actividades del localStorage
   */
  private loadActividadesFromStorage() {
    try {
      const stored = localStorage.getItem('actividades');
      if (stored) {
        const actividades = JSON.parse(stored).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }));
        this.actividadSubject.next(actividades);
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  }

  /**
   * Limpiar actividades
   */
  limpiarActividades() {
    this.actividadSubject.next([]);
    localStorage.removeItem('actividades');
  }
}
