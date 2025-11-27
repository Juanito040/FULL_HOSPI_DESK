import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquiposService, Equipo } from '../../services/equipos.service';
import { EquipoModalComponent } from '../../components/equipo-modal/equipo-modal.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { EquipoDetailModalComponent } from '../../components/equipo-detail-modal/equipo-detail-modal.component';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, EquipoModalComponent, ConfirmDialogComponent, EquipoDetailModalComponent],
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  equipos: Equipo[] = [];
  filteredEquipos: Equipo[] = [];
  searchTerm: string = '';
  selectedActivo: boolean | undefined = undefined;

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  // Modal de edición/creación
  isModalOpen: boolean = false;
  selectedEquipo: Equipo | null = null;

  // Modal de confirmación
  isConfirmDialogOpen: boolean = false;
  equipoToDelete: Equipo | null = null;

  // Modal de detalle
  isDetailModalOpen: boolean = false;
  equipoToView: Equipo | null = null;

  constructor(private equiposService: EquiposService) {}

  ngOnInit() {
    this.loadEquipos();
  }

  /**
   * Cargar equipos desde el backend
   */
  loadEquipos(filters?: { activo?: boolean }) {
    this.isLoading = true;
    this.error = null;

    this.equiposService.getEquipos(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.equipos = Array.isArray(response.data) ? response.data : [response.data];
          this.filteredEquipos = this.equipos;
        } else {
          this.error = response.message || 'Error al cargar los equipos';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
        this.error = 'Error al conectar con el servidor. Por favor, verifica que el backend esté ejecutándose.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Búsqueda en tiempo real
   */
  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    this.applyFilters();
  }

  /**
   * Filtro por estado
   */
  onEstadoChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value === '') {
      this.selectedActivo = undefined;
      this.loadEquipos();
    } else {
      this.selectedActivo = value === '1';
      this.loadEquipos({ activo: this.selectedActivo });
    }
  }

  /**
   * Aplicar filtros locales (búsqueda)
   */
  applyFilters() {
    let filtered = this.equipos;

    // Filtro de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(equipo =>
        equipo.nombre_equipo?.toLowerCase().includes(this.searchTerm) ||
        equipo.marca?.toLowerCase().includes(this.searchTerm) ||
        equipo.modelo?.toLowerCase().includes(this.searchTerm) ||
        equipo.ubicacion?.toLowerCase().includes(this.searchTerm) ||
        equipo.serie?.toLowerCase().includes(this.searchTerm) ||
        equipo.placa_inventario?.toLowerCase().includes(this.searchTerm) ||
        equipo.codigo?.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredEquipos = filtered;
  }

  /**
   * Abrir diálogo de confirmación para eliminar
   */
  confirmDelete(equipo: Equipo) {
    this.equipoToDelete = equipo;
    this.isConfirmDialogOpen = true;
  }

  /**
   * Eliminar un equipo (después de confirmación)
   */
  deleteEquipo() {
    if (!this.equipoToDelete || !this.equipoToDelete.id_sysequipo) return;

    this.equiposService.deleteEquipo(this.equipoToDelete.id_sysequipo).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadEquipos(); // Recargar la lista
          this.closeConfirmDialog();
        } else {
          alert('Error al eliminar el equipo');
        }
      },
      error: (err) => {
        console.error('Error al eliminar equipo:', err);
        alert('Error al conectar con el servidor');
      }
    });
  }

  /**
   * Cerrar diálogo de confirmación
   */
  closeConfirmDialog() {
    this.isConfirmDialogOpen = false;
    this.equipoToDelete = null;
  }

  /**
   * Clase CSS para el badge de estado
   */
  getEstadoBadgeClass(activo: number | undefined): string {
    return `badge badge-${activo === 1 ? 'success' : 'danger'}`;
  }

  /**
   * Formatear estado (activo/inactivo)
   */
  formatEstado(activo: number | undefined): string {
    return activo === 1 ? 'Activo' : 'Inactivo';
  }

  /**
   * Formatear el número de serie para mostrar
   */
  formatSerie(serie: string | undefined): string {
    return serie || 'N/A';
  }

  /**
   * Abrir modal para crear nuevo equipo
   */
  openCreateModal() {
    this.selectedEquipo = null;
    this.isModalOpen = true;
  }

  /**
   * Abrir modal para editar equipo
   */
  openEditModal(equipo: Equipo) {
    this.selectedEquipo = equipo;
    this.isModalOpen = true;
  }

  /**
   * Cerrar modal
   */
  closeModal() {
    this.isModalOpen = false;
    this.selectedEquipo = null;
  }

  /**
   * Evento cuando se guarda un equipo (crear o editar)
   */
  onEquipoSaved() {
    this.loadEquipos(); // Recargar la lista de equipos
  }

  /**
   * Abrir modal de vista detallada
   */
  openDetailModal(equipo: Equipo) {
    this.equipoToView = equipo;
    this.isDetailModalOpen = true;
  }

  /**
   * Cerrar modal de vista detallada
   */
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.equipoToView = null;
  }

  /**
   * Solicitar edición desde el modal de detalle
   */
  onEditFromDetail(equipo: Equipo) {
    this.closeDetailModal();
    this.openEditModal(equipo);
  }
}
