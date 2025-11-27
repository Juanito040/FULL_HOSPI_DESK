import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientosService, Mantenimiento } from '../../services/mantenimientos.service';

@Component({
  selector: 'app-mantenimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  mantenimientos: Mantenimiento[] = [];
  filteredMantenimientos: Mantenimiento[] = [];
  searchTerm: string = '';
  selectedTipo: string = '';
  selectedEstado: string = '';

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private mantenimientosService: MantenimientosService) {}

  ngOnInit() {
    this.loadMantenimientos();
  }

  /**
   * Cargar mantenimientos desde el backend
   */
  loadMantenimientos(filters?: { tipo_mantenimiento?: string; estado?: string }) {
    this.isLoading = true;
    this.error = null;

    this.mantenimientosService.getMantenimientos(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.mantenimientos = Array.isArray(response.data) ? response.data : [response.data];
          this.filteredMantenimientos = this.mantenimientos;
        } else {
          this.error = response.message || 'Error al cargar los mantenimientos';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos:', err);
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
   * Filtro por tipo de mantenimiento
   */
  onTipoChange(event: Event) {
    const tipo = (event.target as HTMLSelectElement).value;
    this.selectedTipo = tipo;
    this.applyBackendFilters();
  }

  /**
   * Filtro por estado
   */
  onEstadoChange(event: Event) {
    const estado = (event.target as HTMLSelectElement).value;
    this.selectedEstado = estado;
    this.applyBackendFilters();
  }

  /**
   * Aplicar filtros del backend
   */
  applyBackendFilters() {
    const filters: any = {};
    if (this.selectedTipo) filters.tipo_mantenimiento = this.selectedTipo;
    if (this.selectedEstado) filters.estado = this.selectedEstado;

    if (Object.keys(filters).length > 0) {
      this.loadMantenimientos(filters);
    } else {
      this.loadMantenimientos();
    }
  }

  /**
   * Aplicar filtros locales (búsqueda)
   */
  applyFilters() {
    let filtered = this.mantenimientos;

    // Filtro de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(mant =>
        mant.numero_reporte?.toLowerCase().includes(this.searchTerm) ||
        mant.nombre_tecnico?.toLowerCase().includes(this.searchTerm) ||
        mant.observaciones?.toLowerCase().includes(this.searchTerm) ||
        mant.descripcion_falla?.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredMantenimientos = filtered;
  }

  /**
   * Eliminar un mantenimiento
   */
  deleteMantenimiento(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
      this.mantenimientosService.deleteMantenimiento(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadMantenimientos();
            alert('Mantenimiento eliminado exitosamente');
          }
        },
        error: (err) => {
          console.error('Error al eliminar mantenimiento:', err);
          alert('Error al eliminar el mantenimiento');
        }
      });
    }
  }

  /**
   * Clase CSS para el badge de tipo de mantenimiento
   */
  getTipoMantenimientoBadgeClass(tipo: string): string {
    const classes: { [key: string]: string } = {
      'Preventivo': 'badge badge-info',
      'Correctivo': 'badge badge-warning',
      'Predictivo': 'badge badge-primary',
      'Otro': 'badge badge-secondary'
    };
    return classes[tipo] || 'badge badge-secondary';
  }

  /**
   * Clase CSS para el badge de estado
   */
  getEstadoBadgeClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'badge badge-warning',
      'en_proceso': 'badge badge-info',
      'completado': 'badge badge-success'
    };
    return classes[estado] || 'badge badge-secondary';
  }

  /**
   * Formatear fecha para mostrar
   */
  formatFecha(fecha: string | undefined): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Formatear estado para mostrar
   */
  formatEstado(estado: string): string {
    return estado === 'en_proceso' ? 'En proceso' : estado.charAt(0).toUpperCase() + estado.slice(1);
  }
}
