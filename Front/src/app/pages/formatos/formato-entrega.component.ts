import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-formato-entrega',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Formato de Entrega"
      descripcion="Formato para actas de entrega de equipos. Próximamente disponible."
      icono="📦">
    </app-en-desarrollo>
  `
})
export class FormatoEntregaComponent {}
