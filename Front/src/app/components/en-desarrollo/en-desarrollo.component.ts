import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-en-desarrollo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './en-desarrollo.component.html',
  styleUrls: ['./en-desarrollo.component.css']
})
export class EnDesarrolloComponent {
  @Input() titulo: string = 'Módulo en Desarrollo';
  @Input() descripcion: string = 'Esta funcionalidad está actualmente en desarrollo y estará disponible próximamente.';
  @Input() icono: string = '🚧';
}
