import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { TokenService } from './token.service';
import { AuthResponse, LoginRequest } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) {}

  login(request: LoginRequest): Observable<void> {
    return this.http.post<AuthResponse>('/api/auth/login', request).pipe(
      tap(response => this.tokenService.save(response.token)),
      map(() => undefined)
    );
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}).subscribe();
    this.tokenService.remove();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  getRole(): string | null {
    return this.tokenService.getRole();
  }

  getUsername(): string | null {
    return this.tokenService.getUsername();
  }

  redirectByRole(): void {
    const role = this.getRole();
    switch (role) {
      case 'ROLE_CLIENT':
        this.router.navigate(['/client/orders']);
        break;
      case 'ROLE_WAREHOUSE_MANAGER':
        this.router.navigate(['/manager/orders']);
        break;
      case 'ROLE_SYSTEM_ADMIN':
        this.router.navigate(['/admin/users']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
