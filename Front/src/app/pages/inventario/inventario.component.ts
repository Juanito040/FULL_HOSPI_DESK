import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquiposComponent } from '../equipos/equipos.component';
import { HojasVidaComponent } from '../hojas-vida/hojas-vida.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, EquiposComponent, HojasVidaComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent {
  activeTab: 'equipos' | 'hojas-vida' = 'equipos';

  setActiveTab(tab: 'equipos' | 'hojas-vida') {
    this.activeTab = tab;
  }
}
