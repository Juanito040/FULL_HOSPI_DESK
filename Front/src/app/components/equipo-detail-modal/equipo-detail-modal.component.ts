import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipo, EquiposService } from '../../services/equipos.service';
import { MantenimientosService, Mantenimiento } from '../../services/mantenimientos.service';
import {
  getTipoMantenimientoLabel,
  getTipoFallaLabel,
  getTipoMantenimientoClass,
  getTipoFallaClass
} from '../../utils/sys-constants';

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
  @Output() equipoActualizado = new EventEmitter<Equipo>();

  // Historial de mantenimientos
  mantenimientos: Mantenimiento[] = [];
  isLoadingMantenimientos: boolean = false;
  showHistorial: boolean = true;

  // Estados de carga para botones
  isChangingEstado: boolean = false;
  isReactivando: boolean = false;

  // Funciones helper expuestas para el template
  getTipoMantenimientoLabel = getTipoMantenimientoLabel;
  getTipoFallaLabel = getTipoFallaLabel;
  getTipoMantenimientoClass = getTipoMantenimientoClass;
  getTipoFallaClass = getTipoFallaClass;

  constructor(
    private mantenimientosService: MantenimientosService,
    private equiposService: EquiposService
  ) {}

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

  /**
   * Cambiar estado activo/inactivo del equipo
   */
  cambiarEstadoActivo() {
    if (!this.equipo || !this.equipo.id_sysequipo || this.isChangingEstado) return;

    const nuevoEstado = this.equipo.activo === 1 ? 0 : 1;
    const mensaje = nuevoEstado === 1 ? 'activar' : 'desactivar';

    if (confirm(`¿Estás seguro de que deseas ${mensaje} este equipo?`)) {
      this.isChangingEstado = true;

      this.equiposService.cambiarEstadoActivo(this.equipo.id_sysequipo, nuevoEstado === 1).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            // Actualizar el equipo localmente
            if (this.equipo) {
              this.equipo.activo = nuevoEstado;
              // Verificar si response.data es un array o un objeto único
              const equipoData = Array.isArray(response.data) ? response.data[0] : response.data;
              if (equipoData) {
                // Actualizar otros campos si es necesario
                this.equipo = { ...this.equipo, ...equipoData };
              }
              // Solo emitir si equipo no es null
              if (this.equipo) {
                this.equipoActualizado.emit(this.equipo);
              }
            }
            alert(`Equipo ${nuevoEstado === 1 ? 'activado' : 'desactivado'} exitosamente`);
          }
          this.isChangingEstado = false;
        },
        error: (err: any) => {
          console.error('Error al cambiar estado:', err);
          alert('Error al cambiar el estado del equipo. Por favor, intenta nuevamente.');
          this.isChangingEstado = false;
        }
      });
    }
  }

  /**
   * Reactivar equipo que está en bodega
   */
  reactivarEquipo() {
    if (!this.equipo || !this.equipo.id_sysequipo || this.isReactivando) return;

    if (confirm('¿Deseas reactivar este equipo? Se marcará como activo y saldrá de bodega.')) {
      this.isReactivando = true;

      this.equiposService.reactivarEquipo(this.equipo.id_sysequipo).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Actualizar el equipo localmente
            if (this.equipo) {
              this.equipo.activo = 1;
              // Verificar si response.data es un array o un objeto único
              const equipoData = Array.isArray(response.data) ? response.data[0] : response.data;
              if (equipoData && equipoData.ubicacion) {
                this.equipo.ubicacion = equipoData.ubicacion;
              }
              this.equipoActualizado.emit(this.equipo);
            }
            alert('Equipo reactivado exitosamente');
          }
          this.isReactivando = false;
        },
        error: (err) => {
          console.error('Error al reactivar equipo:', err);
          alert('Error al reactivar el equipo. Por favor, intenta nuevamente.');
          this.isReactivando = false;
        }
      });
    }
  }

  /**
   * Verificar si el equipo está en bodega
   */
  estaEnBodega(): boolean {
    return this.equipo?.ubicacion?.toLowerCase() === 'bodega';
  }
}
