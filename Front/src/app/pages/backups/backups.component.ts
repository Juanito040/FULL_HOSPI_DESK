import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-backups',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Gestión de Backups"
      descripcion="Módulo de respaldo y recuperación de datos del sistema. Próximamente disponible."
      icono="💾">
    </app-en-desarrollo>
  `
})
export class BackupsComponent {}
