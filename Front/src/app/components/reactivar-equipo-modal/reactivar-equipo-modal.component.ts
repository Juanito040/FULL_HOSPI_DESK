import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ReactivarEquipoData {
  ubicacion: string;
}

@Component({
  selector: 'app-reactivar-equipo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reactivar-equipo-modal.component.html',
  styleUrl: './reactivar-equipo-modal.component.css'
})
export class ReactivarEquipoModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() equipoNombre: string = '';
  @Input() ubicacionAnterior: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<ReactivarEquipoData>();

  ubicacion: string = '';
  isSubmitting: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      // Al abrir el modal, establecer la ubicación sugerida
      this.ubicacion = this.ubicacionAnterior || 'Datacenter Principal';
      this.isSubmitting = false;
    }
  }

  close() {
    if (!this.isSubmitting) {
      this.resetForm();
      this.closed.emit();
    }
  }

  confirm() {
    if (this.isSubmitting) return;

    const ubicacionFinal = this.ubicacion.trim() || 'Bodega';

    this.confirmed.emit({
      ubicacion: ubicacionFinal
    });
  }

  resetForm() {
    this.ubicacion = '';
    this.isSubmitting = false;
  }

  public setSubmitting(value: boolean) {
    this.isSubmitting = value;
  }
}
