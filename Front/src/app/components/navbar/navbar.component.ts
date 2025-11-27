import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  submenu?: SubMenuItem[];
  isOpen?: boolean;
}

interface SubMenuItem {
  label: string;
  path: string;
  icon?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;

  menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      label: 'Menu Principal',
      icon: ''
    },
    {
      path: '/usuarios',
      label: 'Usuario',
      icon: ''
    },
    {
      path: '/mantenimientos',
      label: 'Mantenimiento',
      icon: ''
    },
    {
      path: '/indicadores',
      label: 'Indicadores',
      icon: ''
    },
    {
      path: '/backups',
      label: 'Backups',
      icon: ''
    },
    {
      path: '/inventario',
      label: 'Inventario',
      icon: ''
    }
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSubmenu(item: MenuItem) {
    if (item.submenu) {
      item.isOpen = !item.isOpen;
    }
  }
}
