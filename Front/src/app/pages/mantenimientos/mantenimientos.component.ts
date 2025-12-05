import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientosService, Mantenimiento } from '../../services/mantenimientos.service';
import { ActividadService } from '../../services/actividad.service';
import { SysCatalogosService } from '../../services/sys-catalogos.service';
import {
  CatalogoItem,
  getTipoMantenimientoLabel,
  getTipoFallaLabel,
  getTipoMantenimientoClass,
  getTipoFallaClass
} from '../../utils/sys-constants';

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
  selectedTipo: number | null = null;
  selectedFalla: number | null = null;

  // Catálogos
  tiposMantenimiento: CatalogoItem[] = [];
  tiposFalla: CatalogoItem[] = [];

  // Estados de carga y error
  isLoading: boolean = false;
  error: string | null = null;

  // Funciones helper expuestas para el template
  getTipoMantenimientoLabel = getTipoMantenimientoLabel;
  getTipoFallaLabel = getTipoFallaLabel;
  getTipoMantenimientoClass = getTipoMantenimientoClass;
  getTipoFallaClass = getTipoFallaClass;

  constructor(
    private mantenimientosService: MantenimientosService,
    private actividadService: ActividadService,
    private catalogosService: SysCatalogosService
  ) {}

  ngOnInit() {
    this.loadCatalogos();
    this.loadMantenimientos();
  }

  /**
   * Cargar catálogos desde el backend
   */
  loadCatalogos() {
    this.catalogosService.getAllCatalogos().subscribe({
      next: (catalogos) => {
        this.tiposMantenimiento = catalogos.tiposMantenimiento;
        this.tiposFalla = catalogos.tiposFalla;
      },
      error: (err) => {
        console.error('Error al cargar catálogos:', err);
        // Usar catálogos locales como fallback
        this.tiposMantenimiento = this.catalogosService.getTiposMantenimientoLocal();
        this.tiposFalla = this.catalogosService.getTiposFallaLocal();
      }
    });
  }

  /**
   * Cargar mantenimientos desde el backend
   */
  loadMantenimientos(filters?: { tipo_mantenimiento?: number; tipo_falla?: number }) {
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
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTipo = value ? parseInt(value) : null;
    this.applyBackendFilters();
  }

  /**
   * Filtro por tipo de falla
   */
  onFallaChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedFalla = value ? parseInt(value) : null;
    this.applyBackendFilters();
  }

  /**
   * Aplicar filtros del backend
   */
  applyBackendFilters() {
    const filters: any = {};
    if (this.selectedTipo) filters.tipo_mantenimiento = this.selectedTipo;
    if (this.selectedFalla) filters.tipo_falla = this.selectedFalla;

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
        mant.autor_realizado?.toLowerCase().includes(this.searchTerm) ||
        mant.autor_recibido?.toLowerCase().includes(this.searchTerm) ||
        mant.observacionesh?.toLowerCase().includes(this.searchTerm) ||
        mant.observacioness?.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredMantenimientos = filtered;
  }

  /**
   * Eliminar un mantenimiento
   */
  deleteMantenimiento(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
      // Encontrar el mantenimiento para obtener su número de reporte
      const mantenimiento = this.mantenimientos.find(m => m.id_sysmtto === id);
      const numeroReporte = mantenimiento?.numero_reporte || 'N/A';
      
      this.mantenimientosService.deleteMantenimiento(id).subscribe({
        next: (response) => {
          if (response.success) {
            // Registrar actividad
            this.actividadService.mantenimientoEliminado(numeroReporte);
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
}
