import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DeleteAction {
  action: 'bodega' | 'baja';
  data: {
    motivo?: string;
    justificacion_baja?: string;
    accesorios_reutilizables?: string;
    id_usuario?: number;
    password?: string;
  };
}


@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() itemName: string = '';
  @Input() itemType: string = 'equipo';
  @Input() isAdmin: boolean = false;  // ✅ Controla si se muestra opción de baja
  @Input() hideBodegaOption: boolean = false;  // ✅ Oculta opción de enviar a bodega
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<DeleteAction>();

  selectedAction: 'bodega' | 'baja' = 'bodega';
  password: string = '';
  passwordError: string = '';
  isSubmitting: boolean = false;
  
  // Campos adicionales
  motivo: string = '';
  justificacion_baja: string = '';
  accesorios_reutilizables: string = '';

  /**
   * Detectar cambios en los inputs
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Cuando se abre el diálogo, establecer la acción correcta
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.selectedAction = this.hideBodegaOption ? 'baja' : 'bodega';
      this.password = '';
      this.passwordError = '';
      this.motivo = '';
      this.justificacion_baja = '';
      this.accesorios_reutilizables = '';
    }
  }

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
    // Validar contraseña si es dar de baja
    if (this.selectedAction === 'baja') {
      if (!this.password) {
        this.passwordError = 'La contraseña es requerida para dar de baja';
        return;
      }
      if (this.password !== 'admin') {
        this.passwordError = 'Contraseña incorrecta';
        return;
      }
      if (!this.justificacion_baja) {
        this.passwordError = 'La justificación es requerida';
        return;
      }
    }

    if (this.selectedAction === 'bodega' && !this.motivo) {
      this.passwordError = 'El motivo es requerido para enviar a bodega';
      return;
    }

    this.isSubmitting = true;
    
    const action: DeleteAction = {
      action: this.selectedAction,
      data: {
        motivo: this.selectedAction === 'bodega' ? this.motivo : undefined,
        justificacion_baja: this.selectedAction === 'baja' ? this.justificacion_baja : undefined,
        accesorios_reutilizables: this.selectedAction === 'baja' ? this.accesorios_reutilizables : undefined,
        password: this.selectedAction === 'baja' ? this.password : undefined
      }
    };

    this.confirmed.emit(action);
  }

  /**
   * Cambiar el tipo de acción seleccionada
   */
  onActionChange() {
    this.password = '';
    this.passwordError = '';
    this.motivo = '';
    this.justificacion_baja = '';
    this.accesorios_reutilizables = '';
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
    // Si la opción de bodega está oculta, defaultear a 'baja'
    this.selectedAction = this.hideBodegaOption ? 'baja' : 'bodega';
    this.password = '';
    this.passwordError = '';
    this.isSubmitting = false;
    this.motivo = '';
    this.justificacion_baja = '';
    this.accesorios_reutilizables = '';
  }

  /**
   * Método público para resetear el estado de envío desde el componente padre
   */
  public resetSubmitting() {
    this.isSubmitting = false;
  }

  /**
   * Método público para mostrar un error desde el componente padre
   */
  public showError(message: string) {
    this.passwordError = message;
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
    return this.selectedAction === 'bodega' ? 'Enviar a Bodega' : 'Dar de Baja';
  }

  /**
   * Obtener la clase CSS del botón de confirmación
   */
  get confirmButtonClass(): string {
    return this.selectedAction === 'bodega' ? 'btn-warning' : 'btn-danger';
  }
}
