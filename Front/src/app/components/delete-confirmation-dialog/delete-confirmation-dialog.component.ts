import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DeleteAction {
  type: 'deactivate' | 'delete';
  password?: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() itemName: string = '';
  @Input() itemType: string = 'equipo';
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<DeleteAction>();

  selectedAction: 'deactivate' | 'delete' = 'deactivate';
  password: string = '';
  passwordError: string = '';
  isSubmitting: boolean = false;

  /**
   * Cerrar el diálogo
   */
  close() {
    this.resetForm();
    this.closed.emit();
  }

  /**
   * Confirmar la acción seleccionada
   */
  confirm() {
    // Validar contraseña si es eliminación permanente
    if (this.selectedAction === 'delete') {
      if (!this.password) {
        this.passwordError = 'La contraseña es requerida para eliminar definitivamente';
        return;
      }
      if (this.password !== 'admin') {
        this.passwordError = 'Contraseña incorrecta';
        return;
      }
    }

    this.isSubmitting = true;
    
    const action: DeleteAction = {
      type: this.selectedAction,
      password: this.selectedAction === 'delete' ? this.password : undefined
    };

    this.confirmed.emit(action);
  }

  /**
   * Cambiar el tipo de acción seleccionada
   */
  onActionChange() {
    this.password = '';
    this.passwordError = '';
  }

  /**
   * Limpiar error de contraseña al escribir
   */
  onPasswordInput() {
    this.passwordError = '';
  }

  /**
   * Resetear el formulario
   */
  resetForm() {
    this.selectedAction = 'deactivate';
    this.password = '';
    this.passwordError = '';
    this.isSubmitting = false;
  }

  /**
   * Obtener el título del diálogo
   */
  get dialogTitle(): string {
    return `Confirmar acción sobre ${this.itemType}`;
  }

  /**
   * Obtener el mensaje de confirmación
   */
  get confirmationMessage(): string {
    return `¿Qué deseas hacer con "${this.itemName}"?`;
  }

  /**
   * Obtener el texto del botón de confirmación
   */
  get confirmButtonText(): string {
    return this.selectedAction === 'deactivate' ? 'Inactivar' : 'Eliminar Definitivamente';
  }

  /**
   * Obtener la clase CSS del botón de confirmación
   */
  get confirmButtonClass(): string {
    return this.selectedAction === 'deactivate' ? 'btn-warning' : 'btn-danger';
  }
}
