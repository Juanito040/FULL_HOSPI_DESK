
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EquiposService, Equipo } from "../../services/equipos.service";
import { ActividadService } from "../../services/actividad.service";
import { NotificationService } from "../../services/notification.service";
import { EquipoModalComponent } from "../../components/equipo-modal/equipo-modal.component";
import { ConfirmDialogComponent } from "../../components/confirm-dialog/confirm-dialog.component";
import { EquipoDetailModalComponent } from "../../components/equipo-detail-modal/equipo-detail-modal.component";
import { DeleteOptionsDialogComponent, DeleteAction } from "../../components/delete-options-dialog/delete-options-dialog.component";

@Component({
  selector: "app-equipos",
  standalone: true,
  imports: [
    CommonModule,
    EquipoModalComponent,
    ConfirmDialogComponent,
    EquipoDetailModalComponent,
    DeleteOptionsDialogComponent,
  ],
  templateUrl: "./equipos.component.html",
  styleUrls: ["./equipos.component.css"],
})
export class EquiposComponent implements OnInit {
  equipos: Equipo[] = [];
  filteredEquipos: Equipo[] = [];
  searchTerm: string = "";
  selectedActivo: boolean | undefined = undefined;
  selectedView: 'all' | 'bodega' | 'baja' = 'all';

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

  // Modal de opciones de eliminación
  isDeleteOptionsDialogOpen: boolean = false;
  equipoToDeleteWithOptions: Equipo | null = null;

  constructor(
    private equiposService: EquiposService,
    private actividadService: ActividadService,
    private notificationService: NotificationService
  ) {}

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
          this.equipos = Array.isArray(response.data)
            ? response.data
            : [response.data];
          this.filteredEquipos = this.equipos;
        } else {
          this.error = response.message || "Error al cargar los equipos";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar equipos:", err);
        this.error =
          "Error al conectar con el servidor. Por favor, verifica que el backend esté ejecutándose.";
        this.isLoading = false;
      },
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

    if (value === "") {
      this.selectedActivo = undefined;
      this.loadEquipos();
    } else {
      this.selectedActivo = value === "1";
      this.loadEquipos({ activo: this.selectedActivo });
    }
  }

  /**
   * Cambiar vista (todos, bodega, dados de baja)
   */
  changeView(view: 'all' | 'bodega' | 'baja') {
    this.selectedView = view;
    this.isLoading = true;
    this.error = null;

    if (view === 'bodega') {
      this.equiposService.getEquiposEnBodega().subscribe({
        next: (response) => {
          if (response.success) {
            this.equipos = Array.isArray(response.data) ? response.data : [response.data];
            this.filteredEquipos = this.equipos;
          } else {
            this.error = response.message || 'Error al cargar equipos en bodega';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar equipos en bodega:', err);
          this.error = 'Error al conectar con el servidor';
          this.isLoading = false;
        }
      });
    } else if (view === 'baja') {
      this.equiposService.getEquiposDadosDeBaja().subscribe({
        next: (response) => {
          if (response.success) {
            this.equipos = Array.isArray(response.data) ? response.data : [response.data];
            this.filteredEquipos = this.equipos;
          } else {
            this.error = response.message || 'Error al cargar equipos dados de baja';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar equipos dados de baja:', err);
          this.error = 'Error al conectar con el servidor';
          this.isLoading = false;
        }
      });
    } else {
      this.loadEquipos();
    }
  }

  /**
   * Aplicar filtros locales (búsqueda)
   */
  applyFilters() {
    let filtered = this.equipos;

    // Filtro de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(
        (equipo) =>
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
   * Abrir diálogo de opciones de eliminación
   */
  confirmDelete(equipo: Equipo) {
    this.equipoToDeleteWithOptions = equipo;
    this.isDeleteOptionsDialogOpen = true;
  }

  /**
   * Manejar la confirmación del diálogo de opciones
   */
  handleDeleteOptionsConfirm(event: { action: DeleteAction; data: any }) {
    if (!this.equipoToDeleteWithOptions || !this.equipoToDeleteWithOptions.id_sysequipo) return;

    const id = this.equipoToDeleteWithOptions.id_sysequipo;
    const nombreEquipo = this.equipoToDeleteWithOptions.nombre_equipo || 'Equipo desconocido';

    if (event.action === 'bodega') {
      // Enviar a bodega
      this.equiposService.enviarABodega(id, event.data.motivo).subscribe({
        next: (response) => {
          if (response.success) {
            this.actividadService.equipoEliminado(`${nombreEquipo} - Enviado a bodega`);
            this.notificationService.success(`Equipo "${nombreEquipo}" enviado a bodega exitosamente`);
            this.loadEquipos();
          } else {
            this.notificationService.error(response.message || 'Error al enviar el equipo a bodega');
          }
        },
        error: (err) => {
          console.error('Error al enviar a bodega:', err);
          this.notificationService.error('Error al conectar con el servidor. Por favor, intente nuevamente.');
        }
      });
    } else if (event.action === 'baja') {
      // Dar de baja
      this.equiposService.darDeBaja(id, event.data).subscribe({
        next: (response) => {
          if (response.success) {
            this.actividadService.equipoEliminado(`${nombreEquipo} - Dado de baja`);
            this.notificationService.success(`Equipo "${nombreEquipo}" dado de baja exitosamente`);
            this.loadEquipos();
          } else {
            this.notificationService.error(response.message || 'Error al dar de baja el equipo');
          }
        },
        error: (err) => {
          console.error('Error al dar de baja:', err);
          this.notificationService.error('Error al conectar con el servidor. Por favor, intente nuevamente.');
        }
      });
    }

    this.closeDeleteOptionsDialog();
  }

  /**
   * Cerrar diálogo de opciones de eliminación
   */
  closeDeleteOptionsDialog() {
    this.isDeleteOptionsDialogOpen = false;
    this.equipoToDeleteWithOptions = null;
  }

  /**
   * Abrir diálogo de confirmación para eliminar (deprecated)
   * @deprecated Usar confirmDelete con DeleteOptionsDialog
   */
  confirmDeleteOld(equipo: Equipo) {
    this.equipoToDelete = equipo;
    this.isConfirmDialogOpen = true;
  }

  /**
   * Eliminar un equipo (después de confirmación) (deprecated)
   * @deprecated Usar handleDeleteOptionsConfirm
   */
  deleteEquipo() {
    if (!this.equipoToDelete || !this.equipoToDelete.id_sysequipo) return;

    const nombreEquipo = this.equipoToDelete.nombre_equipo || 'Equipo desconocido';

    this.equiposService
      .deleteEquipo(this.equipoToDelete.id_sysequipo)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Registrar actividad
            this.actividadService.equipoEliminado(nombreEquipo);
            this.loadEquipos(); // Recargar la lista
            this.closeConfirmDialog();
          } else {
            alert("Error al eliminar el equipo");
          }
        },
        error: (err) => {
          console.error("Error al eliminar equipo:", err);
          alert("Error al conectar con el servidor");
        },
      });
  }

  /**
   * Cerrar diálogo de confirmación (deprecated)
   * @deprecated Usar closeDeleteOptionsDialog
   */
  closeConfirmDialog() {
    this.isConfirmDialogOpen = false;
    this.equipoToDelete = null;
  }

  /**
   * Clase CSS para el badge de estado
   */
  getEstadoBadgeClass(activo: number | undefined): string {
    return `badge badge-${activo === 1 ? "success" : "danger"}`;
  }

  /**
   * Formatear estado (activo/inactivo)
   */
  formatEstado(activo: number | undefined): string {
    return activo === 1 ? "Activo" : "Inactivo";
  }

  /**
   * Formatear el número de serie para mostrar
   */
  formatSerie(serie: string | undefined): string {
    return serie || "N/A";
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
