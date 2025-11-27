import { Component } from '@angular/core';
import { EnDesarrolloComponent } from '../../components/en-desarrollo/en-desarrollo.component';

@Component({
  selector: 'app-usuarios-control',
  standalone: true,
  imports: [EnDesarrolloComponent],
  template: `
    <app-en-desarrollo
      titulo="Control de Usuarios"
      descripcion="Gestión completa de usuarios del sistema. Pronto podrás crear, editar, eliminar y asignar permisos a los usuarios."
      icono="👥">
    </app-en-desarrollo>
  `
})
export class UsuariosControlComponent {}
