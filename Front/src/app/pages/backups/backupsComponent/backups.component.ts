import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BackupService } from '../../../services/backups.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BackupsComponent implements OnInit {

  backups: any[] = [];
  filteredBackups: any[] = [];
  pendientes: any[] = [];
  filterText: string = '';
  showPendientes: boolean = false;
  loading = true;

  constructor(
    private backupService: BackupService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBackups();
    this.loadPendientes();
  }

  /** 🚀 Cargar todos los backups */
  loadBackups() {
    this.loading = true;

    this.backupService.getBackups().subscribe({
      next: (res: any) => {
        console.log("📦 Respuesta servidor:", res);

        // Ordenar por ID ascendente (con any tipado)
        this.backups = Array.isArray(res.data)
          ? res.data.sort((a: any, b: any) => a.id_reporte_backup - b.id_reporte_backup)
          : [];

        this.filteredBackups = [...this.backups];

        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error cargando backups:', err);
        this.notificationService.error('Error al cargar los backups');
        this.loading = false;
      }
    });
  }

  /** 🔔 Cargar backups pendientes */
  loadPendientes() {
    this.backupService.getPendingBackups().subscribe({
      next: (res: any) => {
        console.log("📦 Pendientes:", res);

        this.pendientes = Array.isArray(res.data) ? res.data : [];
      },
      error: (err: any) => {
        console.error('❌ Error cargando pendientes:', err);
        this.notificationService.error('Error al cargar backups pendientes');
      }
    });
  }

  togglePendientes() {
    this.showPendientes = !this.showPendientes;
  }

  /** 🔍 Filtrado */
  applyFilter() {
    const filter = this.filterText.toLowerCase();

    this.filteredBackups = this.backups.filter(b =>
      b.tipo_recurso?.toLowerCase().includes(filter) ||
      b.nombre_recurso?.toLowerCase().includes(filter) ||
      b.periodicidad?.toLowerCase().includes(filter) ||
      (b.fecha_backup || '').toLowerCase().includes(filter)
    );
  }
}
