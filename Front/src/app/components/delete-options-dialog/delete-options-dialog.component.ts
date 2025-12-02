import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type DeleteAction = 'bodega' | 'baja' | null;

@Component({
  selector: 'app-delete-options-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-options-dialog.component.html',
  styleUrl: './delete-options-dialog.component.css'
})
export class DeleteOptionsDialogComponent {
  @Input() equipoNombre: string = '';
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<{ action: DeleteAction; data: any }>();

  selectedAction: DeleteAction = null;
  motivo: string = '';
  justificacionBaja: string = '';
  accesoriosReutilizables: string = '';

  selectAction(action: DeleteAction) {
    this.selectedAction = action;
  }

  close() {
    this.selectedAction = null;
    this.motivo = '';
    this.justificacionBaja = '';
    this.accesoriosReutilizables = '';
    this.onClose.emit();
  }

  confirm() {
    if (!this.selectedAction) return;

    const data = this.selectedAction === 'bodega'
      ? { motivo: this.motivo }
      : {
          justificacion_baja: this.justificacionBaja,
          accesorios_reutilizables: this.accesoriosReutilizables
        };

    this.onConfirm.emit({
      action: this.selectedAction,
      data
    });

    this.close();
  }
}
