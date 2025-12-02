import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackupsService, Backup, BackupPendiente } from '../../services/backups.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-backups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'backups.component.html',
  styleUrls: ['backups.component.css']
})
export class BackupsComponent implements OnInit {
  backups: Backup[] = [];
  backupsPendientes: BackupPendiente[] = [];
  usuarios: any[] = [];
  
  loading = false;
  showModal = false;
  showPendientesModal = false;
  currentBackup: Partial<Backup> | null = null;
  isEditMode = false;
  
  filtroUsuario = '';
  filtroTipo = '';
  
  tiposRecurso = ['Servidor virtual', 'Servidor fisico', 'Base de datos', 'Computador', 'Correo', 'Switch', 'TRD', 'Otro'];
  medios = ['Cinta', 'Disco', 'Servidor'];
  periodicidades = ['Diario', 'Semanal', 'Mensual'];

  constructor(
    private backupsService: BackupsService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit() {
    this.cargarBackups();
    this.cargarBackupsPendientes();
    this.cargarUsuarios();
  }

  cargarBackups() {
    this.loading = true;
    this.backupsService.getBackups().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.backups = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar backups:', error);
        this.loading = false;
      }
    });
  }

  cargarBackupsPendientes() {
    this.backupsService.getBackupsPendientes().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.backupsPendientes = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar backups pendientes:', error);
      }
    });
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.usuarios = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  openModal(backup?: Backup) {
    if (backup) {
      this.isEditMode = true;
      this.currentBackup = { ...backup };
    } else {
      this.isEditMode = false;
      this.currentBackup = {};
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentBackup = null;
    this.isEditMode = false;
  }

  saveBackup() {
    if (!this.currentBackup) return;

    if (this.isEditMode && this.currentBackup.id_reporte_backup) {
      this.backupsService.updateBackup(this.currentBackup.id_reporte_backup, this.currentBackup).subscribe({
        next: () => {
          this.cargarBackups();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar backup:', error);
          alert('Error al actualizar el backup');
        }
      });
    } else {
      this.backupsService.createBackup(this.currentBackup as Backup).subscribe({
        next: () => {
          this.cargarBackups();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear backup:', error);
          alert('Error al crear el backup');
        }
      });
    }
  }

  deleteBackup(id: number | undefined) {
    if (!id) return;
    if (!confirm('¿Estás seguro de que quieres eliminar este backup?')) return;

    this.backupsService.deleteBackup(id).subscribe({
      next: () => {
        this.cargarBackups();
      },
      error: (error) => {
        console.error('Error al eliminar backup:', error);
        alert('Error al eliminar el backup');
      }
    });
  }

  verDetallesPendientes(id: number) {
    this.backupsService.getBackupsPendientesDetalle(id).subscribe({
      next: (response) => {
        if (response.success) {
          alert(`Recurso: ${response.data.recurso}\nPeriodicidad: ${response.data.periodicidad}\nÚltimo backup: ${response.data.ultimo_backup}\nFaltantes: ${response.data.faltantes.join(', ')}`);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getNombreUsuario(usuarioId?: number): string {
    if (!usuarioId) return 'Sin asignar';
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Usuario desconocido';
  }

  getMedioIcon(medio: string): string {
    switch (medio) {
      case 'Cinta': return '📼';
      case 'Disco': return '💿';
      case 'Servidor': return '🖥️';
      default: return '📦';
    }
  }

  getPeriodicidadColor(periodicidad: string): string {
    switch (periodicidad) {
      case 'Diario': return 'text-blue-600';
      case 'Semanal': return 'text-green-600';
      case 'Mensual': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  }

  actualizarBackupRealizado(backup: Backup) {
    if (backup.id_reporte_backup) {
      const updated: Partial<Backup> = {
        fecha_backup: new Date().toISOString()
      };
      this.backupsService.updateBackup(backup.id_reporte_backup, updated).subscribe({
        next: () => {
          this.cargarBackups();
          alert('Backup actualizado correctamente');
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al actualizar el backup');
        }
      });
    }
  }

  refrescar() {
    this.cargarBackups();
    this.cargarBackupsPendientes();
  }
}
