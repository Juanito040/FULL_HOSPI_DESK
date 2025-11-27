import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipo } from '../../services/equipos.service';
import { MantenimientosService, Mantenimiento } from '../../services/mantenimientos.service';

@Component({
  selector: 'app-equipo-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo-detail-modal.component.html',
  styleUrls: ['./equipo-detail-modal.component.css']
})
export class EquipoDetailModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() equipo: Equipo | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<Equipo>();

  // Historial de mantenimientos
  mantenimientos: Mantenimiento[] = [];
  isLoadingMantenimientos: boolean = false;
  showHistorial: boolean = true;

  constructor(private mantenimientosService: MantenimientosService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && this.equipo) {
      this.loadMantenimientos();
    }
  }

  /**
   * Cerrar modal
   */
  close() {
    this.closed.emit();
  }

  /**
   * Solicitar edición del equipo
   */
  requestEdit() {
    if (this.equipo) {
      this.editRequested.emit(this.equipo);
    }
  }

  /**
   * Obtener clase de badge según el estado
   */
  getEstadoBadgeClass(activo: number | undefined): string {
    return `badge badge-${activo === 1 ? 'success' : 'danger'}`;
  }

  /**
   * Formatear estado
   */
  formatEstado(activo: number | undefined): string {
    return activo === 1 ? 'Activo' : 'Inactivo';
  }

  /**
   * Formatear fecha
   */
  formatDate(date: string | undefined): string {
    if (!date) return 'No especificada';
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatear valor o mostrar "No especificado"
   */
  formatValue(value: string | undefined): string {
    return value || 'No especificado';
  }

  /**
   * Cargar historial de mantenimientos del equipo
   */
  loadMantenimientos() {
    if (!this.equipo || !this.equipo.id_sysequipo) return;

    this.isLoadingMantenimientos = true;
    this.mantenimientosService.getMantenimientosByEquipo(this.equipo.id_sysequipo).subscribe({
      next: (response) => {
        if (response.success) {
          this.mantenimientos = Array.isArray(response.data) ? response.data : [response.data];
          // Ordenar por fecha descendente
          this.mantenimientos.sort((a, b) => {
            const dateA = new Date(a.fecha || '').getTime();
            const dateB = new Date(b.fecha || '').getTime();
            return dateB - dateA;
          });
        }
        this.isLoadingMantenimientos = false;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos:', err);
        this.mantenimientos = [];
        this.isLoadingMantenimientos = false;
      }
    });
  }

  /**
   * Obtener clase de badge para tipo de mantenimiento
   */
  getTipoMantenimientoBadgeClass(tipo: string | undefined): string {
    const classes: { [key: string]: string } = {
      'Preventivo': 'badge badge-info',
      'Correctivo': 'badge badge-warning',
      'Predictivo': 'badge badge-primary',
      'Otro': 'badge badge-secondary'
    };
    return classes[tipo || ''] || 'badge badge-secondary';
  }

  /**
   * Obtener clase de badge para estado de mantenimiento
   */
  getEstadoMantenimientoBadgeClass(estado: string | undefined): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'badge badge-warning',
      'en_proceso': 'badge badge-info',
      'completado': 'badge badge-success'
    };
    return classes[estado || ''] || 'badge badge-secondary';
  }

  /**
   * Formatear estado de mantenimiento
   */
  formatEstadoMantenimiento(estado: string | undefined): string {
    if (!estado) return 'Pendiente';
    return estado === 'en_proceso' ? 'En proceso' : estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  /**
   * Imprimir o generar PDF
   */
  printToPDF() {
    window.print();
  }

  /**
   * Toggle mostrar/ocultar historial
   */
  toggleHistorial() {
    this.showHistorial = !this.showHistorial;
  }
}
