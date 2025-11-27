import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-formato-mp5',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Formato MP5"
      descripcion="Formato de Mantenimiento Preventivo versión 5. Próximamente disponible."
      icono="📝">
    </app-en-desarrollo>
  `
})
export class FormatoMp5Component {}
