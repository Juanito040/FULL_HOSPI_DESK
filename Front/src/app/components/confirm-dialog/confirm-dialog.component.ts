import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Estás seguro de que deseas continuar?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Input() icon: string = 'fas fa-exclamation-triangle';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  /**
   * Confirmar acción
   */
  confirm() {
    this.confirmed.emit();
  }

  /**
   * Cancelar acción
   */
  cancel() {
    this.cancelled.emit();
  }

  /**
   * Obtener clase del botón según el tipo
   */
  getConfirmButtonClass(): string {
    return `btn btn-${this.type}`;
  }
}
