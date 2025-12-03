import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  submenu?: SubMenuItem[];
  isOpen?: boolean;
  roles?: string[];
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
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  currentUser: Usuario | null = null;
  showUserMenu = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      label: 'Menu Principal',
      icon: ''
    },
    {
      path: '/usuarios',
      label: 'Usuario',
      icon: '',
      roles: ['Administrador']
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
      icon: '',
      roles: ['Administrador', 'Supervisor']
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

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }

  canShowMenuItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return this.authService.hasRole(item.roles);
  }

  getGreetingMessage(): string {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Buenos días' : 'Buenas tardes';

    if (this.currentUser) {
      const firstName = this.currentUser.nombres.split(' ')[0];
      const role = this.currentUser.rol?.nombre || '';
      return `${timeGreeting}, ${firstName} - ${role}`;
    }

    return timeGreeting;
  }
}
