import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Verificar si el usuario ya está autenticado
    if (this.authService.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { nombreUsuario, password } = this.loginForm.value;

      this.authService.login(nombreUsuario, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.success('¡Bienvenido! Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = this.getErrorMessage(error);
          console.log('Mensaje de error a mostrar:', errorMessage);

          // Usar setTimeout para asegurar que el mensaje se muestre correctamente
          setTimeout(() => {
            this.notificationService.error(errorMessage);
          }, 0);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private getErrorMessage(error: any): string {
    console.log('Error completo:', error);
    console.log('Error status:', error.status);
    console.log('Error.error:', error.error);

    // Error de red o servidor no responde
    if (!error || error.status === 0 || !error.status) {
      return 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
    }

    // Mensaje específico del backend (prioridad alta)
    if (error.error && error.error.message && error.error.message.trim() !== '') {
      return error.error.message;
    }

    // Credenciales incorrectas
    if (error.status === 401) {
      return 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.';
    }

    // Cuenta deshabilitada o inactiva
    if (error.status === 403) {
      return 'Tu cuenta está deshabilitada. Por favor, contacta al administrador.';
    }

    // Usuario no encontrado
    if (error.status === 404) {
      return 'Usuario no encontrado. Por favor, verifica tu nombre de usuario.';
    }

    // Datos inválidos
    if (error.status === 400) {
      return 'Datos inválidos. Por favor, verifica tu usuario y contraseña.';
    }

    // Error del servidor
    if (error.status >= 500) {
      return 'Error en el servidor. Por favor, intenta nuevamente más tarde.';
    }

    // Mensaje genérico como último recurso
    return 'Error al iniciar sesión. Por favor, intenta nuevamente.';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get nombreUsuario() {
    return this.loginForm.get('nombreUsuario');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
