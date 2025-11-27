import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-formato-mph',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Formato MPH"
      descripcion="Formato de Mantenimiento Preventivo de Hardware. Próximamente disponible."
      icono="📄">
    </app-en-desarrollo>
  `
})
export class FormatoMphComponent {}
