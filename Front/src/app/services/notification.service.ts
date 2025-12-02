import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private idCounter = 0;

  constructor() {}

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, duration: number = 4000) {
    this.show(message, 'success', duration);
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, duration: number = 5000) {
    this.show(message, 'error', duration);
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, duration: number = 4000) {
    this.show(message, 'warning', duration);
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, duration: number = 4000) {
    this.show(message, 'info', duration);
  }

  /**
   * Muestra una notificación
   */
  private show(message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number) {
    const id = `notification-${this.idCounter++}`;
    const notification: Notification = { id, message, type, duration };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remover después de la duración especificada
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  /**
   * Remueve una notificación por ID
   */
  remove(id: string) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(n => n.id !== id)
    );
  }

  /**
   * Limpia todas las notificaciones
   */
  clear() {
    this.notificationsSubject.next([]);
  }
}
