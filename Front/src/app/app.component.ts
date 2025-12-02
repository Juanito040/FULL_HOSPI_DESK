import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastNotificationComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
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

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'Hospital San Rafael';
}
