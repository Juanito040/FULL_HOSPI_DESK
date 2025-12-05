import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackupService } from '../../../services/backup.service';

// 👉 IMPORTANTE: importar CommonModule y DatePipe
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-formatobackup',
  standalone: true,
  templateUrl: './formatobackup.component.html',
  styleUrls: ['./formatobackup.component.css'],

  // 👉 IMPORTANTE: habilitar los pipes y directivas básicas
  imports: [CommonModule, DatePipe]
})
export class FormatoBackupComponent implements OnInit {

  backup: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backupService: BackupService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.backupService.getBackupById(id).subscribe({
      next: (res) => {
        console.log("BACKUP INDIVIDUAL:", res);
        this.backup = res.data;
        this.loading = false;
      },
      error: err => {
        console.error("❌ Error cargando backup:", err);
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/backups']);
  }
}
