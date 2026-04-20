import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly storageKey = 'wh_token';

  save(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  get(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  remove(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    const token = this.get();
    if (!token) return false;
    try {
      const { exp } = this.decode(token);
      return exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getRole(): string | null {
    const token = this.get();
    if (!token) return null;
    try {
      return this.decode(token).role ?? null;
    } catch {
      return null;
    }
  }

  getUsername(): string | null {
    const token = this.get();
    if (!token) return null;
    try {
      return this.decode(token).sub ?? null;
    } catch {
      return null;
    }
  }

  private decode(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
