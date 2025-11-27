import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-formato-hv',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Formato Hoja de Vida (HV)"
      descripcion="Generación y gestión de formatos de hoja de vida para equipos. Próximamente disponible."
      icono="📋">
    </app-en-desarrollo>
  `
})
export class FormatoHvComponent {}
