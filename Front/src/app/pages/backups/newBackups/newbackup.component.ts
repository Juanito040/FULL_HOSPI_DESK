import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { BackupService } from '../../../services/backup.service';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private backupService: BackupService,
    private router: Router
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
      caso_ms: ['', Validators.required],
      observaciones: [''],
      id_autor_realizado_fk: [null]
    });
  }

guardarBackup() {

  console.log("EJECUTANDO GUARDAR BACKUP");
  console.log(this.backupForm.value);

  if (this.backupForm.invalid) {
    this.backupForm.markAllAsTouched();
    return;
  }

  this.backupService.createBackup(this.backupForm.value).subscribe({
    next: (res) => {
      Swal.fire({
        title: 'Backup creado',
        text: 'El backup se creó correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/backups']);
      });
    },
    error: (err) => {
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un problema al guardar el backup',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  });
}
}