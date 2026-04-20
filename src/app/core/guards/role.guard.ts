import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: string): CanActivateFn => {
  return () => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);

    if (tokenService.getRole() === allowedRole) return true;

    authService.redirectByRole();
    return false;
  };
};
