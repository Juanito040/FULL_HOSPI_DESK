
import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EquiposService, Equipo } from "../../services/equipos.service";
import { ActividadService } from "../../services/actividad.service";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service";  // ✅ Nuevo
import { EquipoModalComponent } from "../../components/equipo-modal/equipo-modal.component";
import { EquipoDetailModalComponent } from "../../components/equipo-detail-modal/equipo-detail-modal.component";
import { DeleteConfirmationDialogComponent, DeleteAction } from "../../components/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { ReactivarEquipoModalComponent, ReactivarEquipoData } from "../../components/reactivar-equipo-modal/reactivar-equipo-modal.component";

@Component({
  selector: "app-equipos",
  standalone: true,
  imports: [
    CommonModule,
    EquipoModalComponent,
    EquipoDetailModalComponent,
    DeleteConfirmationDialogComponent,
    ReactivarEquipoModalComponent,
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

  // Contadores para cada vista
  totalEquipos: number = 0;
  totalBodega: number = 0;
  totalBaja: number = 0;

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  // Modal de edición/creación
  isModalOpen: boolean = false;
  selectedEquipo: Equipo | null = null;

  // Modal de detalle
  isDetailModalOpen: boolean = false;
  equipoToView: Equipo | null = null;

  // Modal de opciones de eliminación
  isDeleteOptionsDialogOpen: boolean = false;
  equipoToDeleteWithOptions: Equipo | null = null;

  // Modal de reactivar equipo
  isReactivarModalOpen: boolean = false;
  equipoToReactivar: Equipo | null = null;
  
  // Referencia al componente de diálogo para control de errores
  @ViewChild(DeleteConfirmationDialogComponent) deleteDialog!: DeleteConfirmationDialogComponent;

  constructor(
    private equiposService: EquiposService,
    private actividadService: ActividadService,
    private notificationService: NotificationService,
    private authService: AuthService  // ✅ Nuevo
  ) {}

  ngOnInit() {
    this.loadEquipos();
    this.loadCounters();
  }

  /**
   * Cargar contadores para las vistas
   */
  loadCounters() {
    // Cargar contador de bodega
    this.equiposService.getEquiposEnBodega().subscribe({
      next: (response) => {
        if (response.success) {
          const data = Array.isArray(response.data) ? response.data : [response.data];
          this.totalBodega = data.length;
        }
      },
      error: (err) => console.error('Error al cargar contador de bodega:', err)
    });

    // Cargar contador de dados de baja
    this.equiposService.getEquiposDadosDeBaja().subscribe({
      next: (response) => {
        if (response.success) {
          const data = Array.isArray(response.data) ? response.data : [response.data];
          this.totalBaja = data.length;
        }
      },
      error: (err) => console.error('Error al cargar contador de baja:', err)
    });
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
          this.totalEquipos = this.equipos.length;
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
    
    // Resetear filtros al cambiar de vista
    this.searchTerm = '';
    this.selectedActivo = undefined;
    this.resetSearchInput();
    this.resetEstadoSelect();

    if (view === 'bodega') {
      this.equiposService.getEquiposEnBodega().subscribe({
        next: (response) => {
          if (response.success) {
            this.equipos = Array.isArray(response.data) ? response.data : [response.data];
            this.filteredEquipos = this.equipos;
            this.totalBodega = this.equipos.length;
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
            this.totalBaja = this.equipos.length;
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
   * Resetear el input de búsqueda
   */
  resetSearchInput() {
    const searchInput = document.querySelector('.search-box input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  /**
   * Resetear el select de estado
   */
  resetEstadoSelect() {
    const estadoSelect = document.querySelector('.filter-select') as HTMLSelectElement;
    if (estadoSelect) {
      estadoSelect.value = '';
    }
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
  handleDeleteOptionsConfirm(deleteAction: DeleteAction) {
    if (!this.equipoToDeleteWithOptions || !this.equipoToDeleteWithOptions.id_sysequipo) return;

    const id = this.equipoToDeleteWithOptions.id_sysequipo;
    const nombreEquipo = this.equipoToDeleteWithOptions.nombre_equipo || 'Equipo desconocido';

    if (deleteAction.action === 'bodega') {
      // Enviar a bodega
      this.equiposService.enviarABodega(id, deleteAction.data.motivo).subscribe({
        next: (response) => {
          if (response.success) {
            this.actividadService.equipoEliminado(`${nombreEquipo} - Enviado a bodega`);
            this.notificationService.success(`Equipo "${nombreEquipo}" enviado a bodega exitosamente`);
            this.loadEquipos();
            this.loadCounters();
            this.closeDeleteOptionsDialog();
          } else {
            this.notificationService.error(response.message || 'Error al enviar el equipo a bodega');
            if (this.deleteDialog) {
              this.deleteDialog.showError(response.message || 'Error al enviar el equipo a bodega');
            }
          }
        },
        error: (err) => {
          console.error('Error al enviar a bodega:', err);
          const errorMessage = err.error?.message || 'Error al conectar con el servidor. Por favor, intente nuevamente.';
          this.notificationService.error(errorMessage);
          
          // Mostrar error en el diálogo sin cerrarlo
          if (this.deleteDialog) {
            this.deleteDialog.showError(errorMessage);
          }
        }
      });
    } else if (deleteAction.action === 'baja') {
      // Dar de baja - asegurar que justificacion_baja existe
      const bajaData = {
        justificacion_baja: deleteAction.data.justificacion_baja || '',
        accesorios_reutilizables: deleteAction.data.accesorios_reutilizables,
        id_usuario: deleteAction.data.id_usuario,
        password: deleteAction.data.password
      };
      
      this.equiposService.darDeBaja(id, bajaData).subscribe({
        next: (response) => {
          if (response.success) {
            this.actividadService.equipoEliminado(`${nombreEquipo} - Dado de baja`);
            this.notificationService.success(`Equipo "${nombreEquipo}" dado de baja exitosamente`);
            this.loadEquipos();
            this.loadCounters();
            this.closeDeleteOptionsDialog();
          } else {
            this.notificationService.error(response.message || 'Error al dar de baja el equipo');
            if (this.deleteDialog) {
              this.deleteDialog.showError(response.message || 'Error al dar de baja el equipo');
            }
          }
        },
        error: (err) => {
          console.error('Error al dar de baja:', err);
          
          // Manejar específicamente el error 401 de contraseña incorrecta
          let errorMessage = 'Error al conectar con el servidor. Por favor, intente nuevamente.';
          
          if (err.status === 401) {
            errorMessage = err.error?.message || 'Contraseña incorrecta';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          
          this.notificationService.error(errorMessage);
          
          // Mostrar error en el diálogo sin cerrarlo
          if (this.deleteDialog) {
            this.deleteDialog.showError(errorMessage);
          }
        }
      });
    }
  }

  /**
   * Cerrar diálogo de opciones de eliminación
   */
  closeDeleteOptionsDialog() {
    this.isDeleteOptionsDialogOpen = false;
    this.equipoToDeleteWithOptions = null;

    // Limpiar el campo de búsqueda si tiene valores no deseados por autocomplete del navegador
    this.cleanSearchInputIfNeeded();
  }

  /**
   * Limpiar el campo de búsqueda si contiene valores no deseados
   */
  private cleanSearchInputIfNeeded() {
    const searchInput = document.querySelector('.search-box input') as HTMLInputElement;
    if (searchInput && searchInput.value && !this.searchTerm) {
      // Si el input tiene un valor pero searchTerm está vacío, el navegador lo autocompletó incorrectamente
      searchInput.value = '';
    }
  }


  /**
   * Verificar si el usuario actual es administrador
   */
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Clase CSS para el badge de estado
   */
  getEstadoBadgeClass(activo: number | undefined): string {
    // Convertir a número y verificar si es 1 (activo)
    // Esto maneja: number (0/1), boolean (true/false), string ('0'/'1'), undefined
    const isActive = Number(activo) === 1;
    return `badge badge-${isActive ? "success" : "danger"}`;
  }

  /**
   * Formatear estado (activo/inactivo)
   */
  formatEstado(activo: number | undefined): string {
    // Convertir a número y verificar si es 1 (activo)
    // Esto maneja: number (0/1), boolean (true/false), string ('0'/'1'), undefined
    const isActive = Number(activo) === 1;
    return isActive ? "Activo" : "Inactivo";
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

  /**
   * Abrir modal para reactivar equipo
   */
  reactivarEquipo(equipo: Equipo) {
    if (!equipo.id_sysequipo) return;
    this.equipoToReactivar = equipo;
    this.isReactivarModalOpen = true;
  }

  /**
   * Cerrar modal de reactivar
   */
  closeReactivarModal() {
    this.isReactivarModalOpen = false;
    this.equipoToReactivar = null;
  }

  /**
   * Manejar confirmación de reactivación
   */
  handleReactivarConfirm(data: ReactivarEquipoData) {
    if (!this.equipoToReactivar || !this.equipoToReactivar.id_sysequipo) return;

    const equipoId = this.equipoToReactivar.id_sysequipo;
    const equipoNombre = this.equipoToReactivar.nombre_equipo;
    const ubicacionFinal = data.ubicacion;

    this.equiposService.reactivarEquipo(equipoId).subscribe({
      next: (response) => {
        if (response.success) {
          // Actualizar la ubicación si es necesaria
          if (ubicacionFinal !== 'Bodega') {
            this.equiposService.updateEquipo(equipoId, {
              ubicacion: ubicacionFinal
            }).subscribe({
              next: () => {
                this.notificationService.success(
                  `Equipo "${equipoNombre}" reactivado exitosamente\nNueva ubicación: ${ubicacionFinal}`
                );
                this.actividadService.equipoEliminado(
                  `${equipoNombre} - Reactivado desde bodega → ${ubicacionFinal}`
                );
                this.closeReactivarModal();
                this.changeView('bodega');
                this.loadCounters();
              },
              error: (err) => {
                console.error('Error al actualizar ubicación:', err);
                this.notificationService.warning(
                  'Equipo reactivado, pero hubo un error al cambiar la ubicación'
                );
                this.closeReactivarModal();
                this.changeView('bodega');
                this.loadCounters();
              }
            });
          } else {
            this.notificationService.success(
              `Equipo "${equipoNombre}" reactivado en bodega`
            );
            this.actividadService.equipoEliminado(
              `${equipoNombre} - Reactivado en bodega (activo)`
            );
            this.closeReactivarModal();
            this.changeView('bodega');
            this.loadCounters();
          }
        } else {
          this.notificationService.error(response.message || 'Error al reactivar el equipo');
          this.closeReactivarModal();
        }
      },
      error: (err) => {
        console.error('Error al reactivar equipo:', err);
        this.notificationService.error('Error al conectar con el servidor');
        this.closeReactivarModal();
      }
    });
  }

}
