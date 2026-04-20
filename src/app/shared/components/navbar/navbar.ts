import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: false
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  readonly username = this.authService.getUsername();

  logout(): void {
    this.authService.logout();
  }
}
