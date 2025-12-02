import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquiposService, Equipo } from '../../services/equipos.service';
import { HojasVidaService, HojaVida } from '../../services/hojas-vida.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ActividadService } from '../../services/actividad.service';
import { NotificationService } from '../../services/notification.service';
import { forkJoin } from 'rxjs';

interface LookupItem {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-equipo-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipo-modal.component.html',
  styleUrls: ['./equipo-modal.component.css']
})
export class EquipoModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() equipo: Equipo | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  equipoForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  // Lookup data for dropdowns
  hospitales: LookupItem[] = [];
  servicios: LookupItem[] = [];
  tiposEquipo: LookupItem[] = [];
  usuarios: LookupItem[] = [];

  // Campos de fecha dinámicos basados en periodicidad
  fechasMantenimiento: number[] = [];

  // Control de sección de hoja de vida
  hojaVidaExpanded: boolean = true;

  constructor(
    private fb: FormBuilder,
    private equiposService: EquiposService,
    private hojasVidaService: HojasVidaService,
    private usuariosService: UsuariosService,
    private actividadService: ActividadService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadLookupData();
    this.setupPeriodicidadListener();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && this.equipoForm) {
      if (this.equipo) {
        // Modo edición
        this.equipoForm.patchValue(this.equipo);
      } else {
        // Modo creación
        this.equipoForm.reset();
        // Restablecer valores por defecto
        this.equipoForm.patchValue({
          activo: 1,
          mtto: 1,
          administrable: 0
        });
      }
      this.errorMessage = null;
    }
  }

  /**
   * Cargar datos de lookup para los dropdowns
   * TODO: Reemplazar con llamadas a API reales cuando estén disponibles
   */
  loadLookupData() {
    // Datos temporales - reemplazar con llamadas a servicios
    this.hospitales = [
      { id: 1, nombre: 'Hospital San Rafael' },
      { id: 2, nombre: 'Hospital Central' }
    ];

    this.servicios = [
      { id: 1, nombre: 'Sistemas e Informática' },
      { id: 2, nombre: 'Mantenimiento' },
      { id: 3, nombre: 'Urgencias' },
      { id: 4, nombre: 'Consulta Externa' }
    ];

    this.tiposEquipo = [
      { id: 1, nombre: 'Computador de Escritorio' },
      { id: 2, nombre: 'Portátil' },
      { id: 3, nombre: 'Servidor' },
      { id: 4, nombre: 'Switch' },
      { id: 5, nombre: 'Router' },
      { id: 6, nombre: 'Impresora' }
    ];

    // Cargar usuarios reales desde la API
    this.usuariosService.getUsuariosActivos().subscribe({
      next: (response) => {
        if (response.success) {
          const usuarios = Array.isArray(response.data) ? response.data : [response.data];
          this.usuarios = usuarios.map(u => ({
            id: u.id,
            nombre: `${u.nombres} ${u.apellidos}`
          }));
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        // Mantener usuarios por defecto en caso de error
        this.usuarios = [
          { id: 1, nombre: 'Administrador del Sistema' },
          { id: 2, nombre: 'Técnico de Soporte' },
          { id: 3, nombre: 'Coordinador TI' }
        ];
      }
    });
  }

  /**
   * Inicializar formulario
   */
  initForm() {
    this.equipoForm = this.fb.group({
      // Campos del equipo
      nombre_equipo: ['', [Validators.required, Validators.maxLength(255)]],
      marca: ['', [Validators.maxLength(255)]],
      modelo: ['', [Validators.maxLength(255)]],
      serie: ['', [Validators.maxLength(255)]],
      placa_inventario: ['', [Validators.maxLength(255)]],
      codigo: ['', [Validators.maxLength(255)]],
      ubicacion: ['', [Validators.maxLength(255)]],
      ubicacion_especifica: ['', [Validators.maxLength(255)]],
      activo: [1], // 1 = activo, 0 = inactivo
      ano_ingreso: ['', [Validators.min(1900), Validators.max(2100)]],
      dias_mantenimiento: ['', [Validators.min(0)]],
      periodicidad: ['', [Validators.min(0)]],
      administrable: [0], // 0 = no, 1 = sí
      direccionamiento_Vlan: ['', [Validators.maxLength(255)]],
      numero_puertos: ['', [Validators.min(0)]],
      mtto: [1], // 1 = sí, 0 = no
      id_hospital_fk: [''],
      id_servicio_fk: [''],
      id_tipo_equipo_fk: [''],
      id_usuario_fk: [''],

      // Campos de hoja de vida
      ip: ['', [Validators.maxLength(255)]],
      mac: ['', [Validators.maxLength(255)]],
      procesador: ['', [Validators.maxLength(255)]],
      ram: ['', [Validators.maxLength(255)]],
      disco_duro: ['', [Validators.maxLength(255)]],
      sistema_operativo: ['', [Validators.maxLength(255)]],
      office: ['', [Validators.maxLength(255)]],
      tonner: ['', [Validators.maxLength(255)]],
      nombre_usuario: ['', [Validators.maxLength(255)]],
      vendedor: ['', [Validators.maxLength(255)]],
      tipo_uso: ['', [Validators.maxLength(255)]],
      fecha_compra: [''],
      fecha_instalacion: [''],
      costo_compra: ['', [Validators.min(0)]],
      contrato: ['', [Validators.maxLength(255)]],
      observaciones: [''],
      foto: ['', [Validators.maxLength(255)]],
      compraddirecta: [false],
      convenio: [false],
      donado: [false],
      comodato: [false]
    });
  }

  /**
   * Obtener título del modal
   */
  get modalTitle(): string {
    return this.equipo ? 'Editar Equipo' : 'Nuevo Equipo';
  }

  /**
   * Verificar si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.equipoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtener mensaje de error de un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.equipoForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (field.hasError('min')) {
      const min = field.errors?.['min'].min;
      return `Valor mínimo: ${min}`;
    }
    if (field.hasError('max')) {
      const max = field.errors?.['max'].max;
      return `Valor máximo: ${max}`;
    }
    return '';
  }

  /**
   * Configurar listener para cambios en periodicidad
   */
  setupPeriodicidadListener() {
    this.equipoForm.get('periodicidad')?.valueChanges.subscribe(value => {
      this.updateFechasMantenimiento(value);
    });
  }

  /**
   * Actualizar campos de fecha según la periodicidad seleccionada
   */
  updateFechasMantenimiento(periodicidad: string) {
    // Limpiar campos de fecha existentes
    this.fechasMantenimiento.forEach((_, index) => {
      this.equipoForm.removeControl(`fecha_mantenimiento_${index + 1}`);
    });
    this.fechasMantenimiento = [];

    // Determinar cantidad de campos según periodicidad
    let cantidadCampos = 0;
    switch(periodicidad) {
      case '365': // Anual
        cantidadCampos = 1;
        break;
      case '180': // Semestral
        cantidadCampos = 2;
        break;
      case '120': // Cuatrimestral
        cantidadCampos = 4;
        break;
      case '90': // Trimestral
        cantidadCampos = 3;
        break;
      default:
        cantidadCampos = 0;
    }

    // Crear campos de fecha dinámicamente
    for (let i = 0; i < cantidadCampos; i++) {
      this.fechasMantenimiento.push(i);
      this.equipoForm.addControl(`fecha_mantenimiento_${i + 1}`, this.fb.control('', Validators.required));
    }
  }

  /**
   * Obtener etiqueta para campo de fecha según periodicidad
   */
  getFechaLabel(index: number): string {
    const periodicidad = this.equipoForm.get('periodicidad')?.value;
    switch(periodicidad) {
      case '365': // Anual
        return 'Fecha de Mantenimiento Anual';
      case '180': // Semestral
        return `Fecha de Mantenimiento ${index + 1}° Semestre`;
      case '120': // Cuatrimestral
        return `Fecha de Mantenimiento ${index + 1}° Cuatrimestre`;
      case '90': // Trimestral
        return `Fecha de Mantenimiento ${index + 1}° Trimestre`;
      default:
        return `Fecha de Mantenimiento ${index + 1}`;
    }
  }

  /**
   * Alternar expansión de sección de hoja de vida
   */
  toggleHojaVida() {
    this.hojaVidaExpanded = !this.hojaVidaExpanded;
  }

  /**
   * Cerrar modal
   */
  close() {
    this.equipoForm.reset();
    this.errorMessage = null;
    this.closed.emit();
  }

  /**
   * Guardar equipo y hoja de vida
   */
  save() {
    if (this.equipoForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.equipoForm.controls).forEach(key => {
        this.equipoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = this.equipoForm.value;

    // Separar datos de equipo y hoja de vida
    const equipoData: Equipo = {
      nombre_equipo: formData.nombre_equipo,
      marca: formData.marca,
      modelo: formData.modelo,
      serie: formData.serie,
      placa_inventario: formData.placa_inventario,
      codigo: formData.codigo,
      ubicacion: formData.ubicacion,
      ubicacion_especifica: formData.ubicacion_especifica,
      activo: formData.activo,
      ano_ingreso: formData.ano_ingreso,
      dias_mantenimiento: formData.dias_mantenimiento,
      periodicidad: formData.periodicidad,
      administrable: formData.administrable,
      direccionamiento_Vlan: formData.direccionamiento_Vlan,
      numero_puertos: formData.numero_puertos,
      mtto: formData.mtto,
      id_hospital_fk: formData.id_hospital_fk,
      id_servicio_fk: formData.id_servicio_fk,
      id_tipo_equipo_fk: formData.id_tipo_equipo_fk,
      id_usuario_fk: formData.id_usuario_fk
    };

    const hojaVidaData: HojaVida = {
      ip: formData.ip,
      mac: formData.mac,
      procesador: formData.procesador,
      ram: formData.ram,
      disco_duro: formData.disco_duro,
      sistema_operativo: formData.sistema_operativo,
      office: formData.office,
      tonner: formData.tonner,
      nombre_usuario: formData.nombre_usuario,
      vendedor: formData.vendedor,
      tipo_uso: formData.tipo_uso,
      fecha_compra: formData.fecha_compra,
      fecha_instalacion: formData.fecha_instalacion,
      costo_compra: formData.costo_compra,
      contrato: formData.contrato,
      observaciones: formData.observaciones,
      foto: formData.foto,
      compraddirecta: formData.compraddirecta,
      convenio: formData.convenio,
      donado: formData.donado,
      comodato: formData.comodato
    };

    if (this.equipo && this.equipo.id_sysequipo) {
      // Actualizar equipo existente y su hoja de vida
      this.equiposService.updateEquipo(this.equipo.id_sysequipo, equipoData).subscribe({
        next: (response) => {
          if (response.success) {
            // Actualizar o crear hoja de vida
            hojaVidaData.id_sysequipo_fk = this.equipo!.id_sysequipo;

            // Intentar obtener la hoja de vida existente
            this.hojasVidaService.getHojaVidaByEquipoId(this.equipo!.id_sysequipo!).subscribe({
              next: (hojaResponse) => {
                if (hojaResponse.success && hojaResponse.data) {
                  const hojaVidaExistente = Array.isArray(hojaResponse.data) ? hojaResponse.data[0] : hojaResponse.data;
                  // Actualizar hoja de vida existente
                  this.hojasVidaService.updateHojaVida(hojaVidaExistente.id_syshoja_vida!, this.limpiarHojaVida(hojaVidaData)).subscribe({
                    next: () => {
                      this.isSubmitting = false;
                      // Registrar actividad
                      this.actividadService.equipoActualizado(formData.nombre_equipo);
                      this.notificationService.success(`Equipo "${formData.nombre_equipo}" actualizado exitosamente`);
                      this.saved.emit();
                      this.close();
                    },
                    error: (err) => {
                      console.error('Error al actualizar hoja de vida:', err);
                      this.isSubmitting = false;
                      this.notificationService.warning('Equipo actualizado, pero hubo un error al actualizar la hoja de vida');
                    }
                  });
                } else {
                  // Crear nueva hoja de vida
                  this.hojasVidaService.createHojaVida(this.limpiarHojaVida(hojaVidaData)).subscribe({
                    next: () => {
                      this.isSubmitting = false;
                      // Registrar actividad
                      this.actividadService.equipoActualizado(formData.nombre_equipo);
                      this.notificationService.success(`Equipo "${formData.nombre_equipo}" actualizado exitosamente`);
                      this.saved.emit();
                      this.close();
                    },
                    error: (err) => {
                      console.error('Error al crear hoja de vida:', err);
                      this.isSubmitting = false;
                      this.notificationService.warning('Equipo actualizado, pero hubo un error al crear la hoja de vida');
                    }
                  });
                }
              },
              error: () => {
                // Si no existe, crear nueva
                this.hojasVidaService.createHojaVida(this.limpiarHojaVida(hojaVidaData)).subscribe({
                  next: () => {
                    this.isSubmitting = false;
                    // Registrar actividad
                    this.actividadService.equipoActualizado(formData.nombre_equipo);
                    this.notificationService.success(`Equipo "${formData.nombre_equipo}" actualizado exitosamente`);
                    this.saved.emit();
                    this.close();
                  },
                  error: (err) => {
                    console.error('Error al crear hoja de vida:', err);
                    this.isSubmitting = false;
                    this.notificationService.warning('Equipo actualizado, pero hubo un error al crear la hoja de vida');
                  }
                });
              }
            });
          } else {
            this.isSubmitting = false;
            this.notificationService.error(response.message || 'Error al actualizar el equipo');
          }
        },
        error: (err) => {
          console.error('Error al actualizar equipo:', err);
          this.isSubmitting = false;
          const errorMsg = err.error?.message || 'Error al conectar con el servidor';
          this.notificationService.error(errorMsg);
        }
      });
    } else {
      // Crear nuevo equipo con su hoja de vida en una sola transacción
      const equipoConHojaVida = {
        ...equipoData,
        hojaVida: this.limpiarHojaVida(hojaVidaData)
      };

      this.equiposService.createEquipo(equipoConHojaVida).subscribe({
        next: (response) => {
          if (response.success) {
            const equipoCreado = Array.isArray(response.data) ? response.data[0] : response.data;
            this.isSubmitting = false;

            // Registrar actividades
            this.actividadService.equipoCreado(equipoCreado.nombre_equipo, equipoCreado.marca, equipoCreado.modelo);
            this.actividadService.hojaVidaCreada(equipoCreado.nombre_equipo);

            // Mostrar notificación de éxito
            this.notificationService.success(
              `Equipo "${equipoCreado.nombre_equipo}" creado exitosamente con su hoja de vida`
            );

            this.saved.emit();
            this.close();
          } else {
            this.isSubmitting = false;
            this.notificationService.error(
              response.message || 'Error al crear el equipo. Por favor, intente nuevamente.'
            );
          }
        },
        error: (err) => {
          console.error('Error al crear equipo:', err);
          this.isSubmitting = false;

          // Mostrar mensaje de error específico o genérico
          const errorMsg = err.error?.message || err.error?.errors?.[0]?.msg || 'Error al conectar con el servidor';
          this.notificationService.error(errorMsg);
        }
      });
    }
  }

  /**
   * Limpia la hoja de vida eliminando campos vacíos y asegurando tipos correctos
   */
  private limpiarHojaVida(hojaVida: any): any {
    const limpia: any = {};

    // Solo incluir campos que tengan valores no vacíos
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
