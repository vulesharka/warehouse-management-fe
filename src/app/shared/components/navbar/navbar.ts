import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: false
})
export class NavbarComponent {
  readonly username: string | null;
  readonly role: string | null;

  constructor(private readonly authService: AuthService) {
    this.username = this.authService.getUsername();
    this.role = this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
