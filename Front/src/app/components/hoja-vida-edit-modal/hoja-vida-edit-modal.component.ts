import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HojasVidaService, HojaVida } from '../../services/hojas-vida.service';
import { NotificationService } from '../../services/notification.service';
import { ActividadService } from '../../services/actividad.service';

@Component({
  selector: 'app-hoja-vida-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hoja-vida-edit-modal.component.html',
  styleUrl: './hoja-vida-edit-modal.component.css'
})
export class HojaVidaEditModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() hojaVida: any | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  hojaVidaForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private hojasVidaService: HojasVidaService,
    private notificationService: NotificationService,
    private actividadService: ActividadService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hojaVida'] && this.hojaVida) {
      this.populateForm();
    }
  }

  /**
   * Inicializar el formulario
   */
  initForm() {
    this.hojaVidaForm = this.fb.group({
      // Especificaciones técnicas
      ip: [''],
      mac: [''],
      procesador: [''],
      ram: [''],
      disco_duro: [''],
      sistema_operativo: [''],
      office: [''],
      tonner: [''],

      // Información de usuario y proveedor
      nombre_usuario: [''],
      vendedor: [''],
      tipo_uso: [''],

      // Fechas y costos
      fecha_compra: [''],
      fecha_instalacion: [''],
      costo_compra: [''],
      contrato: [''],

      // Observaciones
      observaciones: [''],
      foto: [''],

      // Tipo de adquisición
      compraddirecta: [false],
      convenio: [false],
      donado: [false],
      comodato: [false]
    });
  }

  /**
   * Poblar el formulario con los datos de la hoja de vida
   */
  populateForm() {
    if (this.hojaVida) {
      this.hojaVidaForm.patchValue({
        ip: this.hojaVida.ip || '',
        mac: this.hojaVida.mac || '',
        procesador: this.hojaVida.procesador || '',
        ram: this.hojaVida.ram || '',
        disco_duro: this.hojaVida.disco_duro || '',
        sistema_operativo: this.hojaVida.sistema_operativo || '',
        office: this.hojaVida.office || '',
        tonner: this.hojaVida.tonner || '',
        nombre_usuario: this.hojaVida.nombre_usuario || '',
        vendedor: this.hojaVida.vendedor || '',
        tipo_uso: this.hojaVida.tipo_uso || '',
        fecha_compra: this.hojaVida.fecha_compra ? this.formatDateForInput(this.hojaVida.fecha_compra) : '',
        fecha_instalacion: this.hojaVida.fecha_instalacion ? this.formatDateForInput(this.hojaVida.fecha_instalacion) : '',
        costo_compra: this.hojaVida.costo_compra || '',
        contrato: this.hojaVida.contrato || '',
        observaciones: this.hojaVida.observaciones || '',
        foto: this.hojaVida.foto || '',
        compraddirecta: this.hojaVida.compraddirecta || false,
        convenio: this.hojaVida.convenio || false,
        donado: this.hojaVida.donado || false,
        comodato: this.hojaVida.comodato || false
      });
    }
  }

  /**
   * Formatear fecha para input[type="date"]
   */
  formatDateForInput(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Cerrar el modal
   */
  close() {
    this.hojaVidaForm.reset();
    this.closed.emit();
  }

  /**
   * Guardar cambios
   */
  save() {
    if (!this.hojaVida || !this.hojaVida.id_syshoja_vida) {
      this.notificationService.error('No se puede actualizar: ID de hoja de vida no encontrado');
      return;
    }

    this.isSubmitting = true;

    const formData = this.hojaVidaForm.value;
    const hojaVidaData = this.limpiarHojaVida(formData);

    this.hojasVidaService.updateHojaVida(this.hojaVida.id_syshoja_vida, hojaVidaData).subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting = false;
          const equipoNombre = this.hojaVida.equipo?.nombre_equipo || 'Equipo';

          // Registrar actividad
          this.actividadService.hojaVidaActualizada(equipoNombre);

          this.notificationService.success(`Hoja de vida de "${equipoNombre}" actualizada exitosamente`);
          this.saved.emit();
          this.close();
        } else {
          this.isSubmitting = false;
          this.notificationService.error(response.message || 'Error al actualizar la hoja de vida');
        }
      },
      error: (err) => {
        console.error('Error al actualizar hoja de vida:', err);
        this.isSubmitting = false;
        const errorMsg = err.error?.message || err.error?.errors?.[0]?.msg || 'Error al conectar con el servidor';
        this.notificationService.error(errorMsg);
      }
    });
  }

  /**
   * Limpia la hoja de vida eliminando campos vacíos y asegurando tipos correctos
   */
  private limpiarHojaVida(hojaVida: any): any {
    const limpia: any = {};

    Object.keys(hojaVida).forEach(key => {
      const valor = hojaVida[key];

      // Omitir valores undefined, null, o strings vacíos
      if (valor === undefined || valor === null || valor === '') {
        return;
      }

      // Para booleanos, asegurar que sean booleanos
      if (key === 'compraddirecta' || key === 'convenio' || key === 'donado' || key === 'comodato') {
        limpia[key] = Boolean(valor);
        return;
      }

      // Para costo_compra, asegurar que sea número entero
      if (key === 'costo_compra') {
        const num = parseInt(valor, 10);
        if (!isNaN(num) && num >= 0) {
          limpia[key] = num;
        }
        return;
      }

      // Para el resto de campos, incluir si no están vacíos
      limpia[key] = valor;
    });

    return limpia;
  }
}
