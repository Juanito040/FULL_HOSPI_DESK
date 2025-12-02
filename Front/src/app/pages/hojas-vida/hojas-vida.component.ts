import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HojasVidaService, HojaVida } from '../../services/hojas-vida.service';
import { HojaVidaEditModalComponent } from '../../components/hoja-vida-edit-modal/hoja-vida-edit-modal.component';

@Component({
  selector: 'app-hojas-vida',
  standalone: true,
  imports: [CommonModule, HojaVidaEditModalComponent],
  templateUrl: './hojas-vida.component.html',
  styleUrl: './hojas-vida.component.css'
})
export class HojasVidaComponent implements OnInit {
  hojasVida: any[] = [];
  filteredHojasVida: any[] = [];
  searchTerm: string = '';

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  // Modal de detalle
  selectedHojaVida: any | null = null;
  isDetailModalOpen: boolean = false;

  // Modal de edición
  hojaVidaToEdit: any | null = null;
  isEditModalOpen: boolean = false;

  constructor(private hojasVidaService: HojasVidaService) {}

  ngOnInit() {
    this.loadHojasVida();
  }

  /**
   * Cargar hojas de vida desde el backend
   */
  loadHojasVida() {
    this.isLoading = true;
    this.error = null;

    this.hojasVidaService.getHojasVida().subscribe({
      next: (response) => {
        if (response.success) {
          this.hojasVida = Array.isArray(response.data)
            ? response.data
            : [response.data];
          this.filteredHojasVida = this.hojasVida;
        } else {
          this.error = response.message || 'Error al cargar las hojas de vida';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar hojas de vida:', err);
        this.error =
          'Error al conectar con el servidor. Por favor, verifica que el backend esté ejecutándose.';
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
   * Aplicar filtros de búsqueda
   */
  applyFilters() {
    this.filteredHojasVida = this.hojasVida.filter((hv) => {
      const matchSearch =
        !this.searchTerm ||
        hv.ip?.toLowerCase().includes(this.searchTerm) ||
        hv.mac?.toLowerCase().includes(this.searchTerm) ||
        hv.procesador?.toLowerCase().includes(this.searchTerm) ||
        hv.sistema_operativo?.toLowerCase().includes(this.searchTerm) ||
        hv.nombre_usuario?.toLowerCase().includes(this.searchTerm) ||
        hv.equipo?.nombre_equipo?.toLowerCase().includes(this.searchTerm) ||
        hv.equipo?.marca?.toLowerCase().includes(this.searchTerm) ||
        hv.equipo?.modelo?.toLowerCase().includes(this.searchTerm);

      return matchSearch;
    });
  }

  /**
   * Ver detalle de hoja de vida
   */
  viewDetail(hojaVida: any) {
    this.selectedHojaVida = hojaVida;
    this.isDetailModalOpen = true;
  }

  /**
   * Cerrar modal de detalle
   */
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedHojaVida = null;
  }

  /**
   * Formatear fecha
   */
  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES');
  }

  /**
   * Formatear moneda
   */
  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  /**
   * Abrir modal de edición
   */
  openEditModal(hojaVida: any) {
    this.hojaVidaToEdit = hojaVida;
    this.isEditModalOpen = true;
  }

  /**
   * Cerrar modal de edición
   */
  closeEditModal() {
    this.isEditModalOpen = false;
    this.hojaVidaToEdit = null;
  }

  /**
   * Evento cuando se guarda una hoja de vida
   */
  onHojaVidaSaved() {
    this.loadHojasVida();
    this.closeEditModal();
  }
}
