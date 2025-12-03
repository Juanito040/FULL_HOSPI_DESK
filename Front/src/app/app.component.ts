import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastNotificationComponent],
  template: `
    <app-navbar *ngIf="shouldShowNavbar()"></app-navbar>
    <main [class]="shouldShowNavbar() ? 'main-content' : 'main-content-full'">
      <router-outlet></router-outlet>
    </main>
    <app-toast-notification></app-toast-notification>
  `,
  styles: [`
    .main-content {
      margin-top: 4rem;
      min-height: calc(100vh - 4rem);
      padding: 2rem 0;
    }

    .main-content-full {
      min-height: 100vh;
      padding: 0;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'Hospital San Rafael';
  currentRoute = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  shouldShowNavbar(): boolean {
    return this.currentRoute !== '/login' && this.authService.getToken() !== null;
  }
}
