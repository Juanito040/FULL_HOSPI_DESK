import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Inventario"
      descripcion="Gestión completa del inventario de equipos y recursos. Próximamente disponible."
      icono="📦">
    </app-en-desarrollo>
  `
})
export class InventarioComponent {}
