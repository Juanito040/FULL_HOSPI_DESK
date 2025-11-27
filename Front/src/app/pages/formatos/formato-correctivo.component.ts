import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-formato-correctivo',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Formato de Mantenimiento Correctivo"
      descripcion="Formato para registro de mantenimientos correctivos. Próximamente disponible."
      icono="🔧">
    </app-en-desarrollo>
  `
})
export class FormatoCorrectivoComponent {}
