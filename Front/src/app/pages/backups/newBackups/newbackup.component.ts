import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackupService } from '../../../services/backups.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-new-backup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newbackup.component.html',
  styleUrls: ['./newbackup.component.css']
})
export class NewBackupComponent {

  tiposRecurso = [
    'Servidor virtual',
    'Servidor fisico',
    'Base de datos',
    'Computador',
    'Correo',
    'Switch',
    'TRD',
    'Otro'
  ];

  medios = ['Cinta', 'Disco', 'Servidor'];
  periodicidades = ['Diario', 'Semanal', 'Mensual'];
  casosMS = ['Si', 'No'];

  backupForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private backupService: BackupService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.backupForm = this.fb.group({
      nombre_recurso: ['', Validators.required],
      tipo_recurso: ['', Validators.required],
      destino: [''],
      medio: ['', Validators.required],
      periodicidad: ['', Validators.required],
      fecha_backup: [''],
      tamano: [''],
      autor_solicita: [''],
      numero_caso_ms: [''],
      caso_ms: ['No', Validators.required],
      observaciones: [''],
      id_autor_realizado_fk: [null]
    });
  }

  guardarBackup() {
    console.log("EJECUTANDO GUARDAR BACKUP");
    console.log(this.backupForm.value);

    if (this.backupForm.invalid) {
      this.backupForm.markAllAsTouched();
      this.notificationService.warning('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;

    this.backupService.createBackup(this.backupForm.value).subscribe({
      next: (res) => {
        this.notificationService.success('Backup creado exitosamente');
        setTimeout(() => {
          this.router.navigate(['/backups']);
        }, 1000);
      },
      error: (err) => {
        console.error('Error al crear backup:', err);
        this.notificationService.error('Error al crear el backup');
        this.loading = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/backups']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.backupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
