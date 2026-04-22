import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private readonly snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.url.includes('/api/auth/')) {
          return throwError(() => error);
        }
        const message = error.error?.message ?? this.defaultMessage(error.status);
        this.snackBar.open(message, 'Close', { duration: 4000, panelClass: 'error-snackbar' });
        return throwError(() => error);
      })
    );
  }

  private defaultMessage(status: number): string {
    switch (status) {
      case 400: return 'Invalid request';
      case 403: return 'Access denied';
      case 404: return 'Resource not found';
      case 500: return 'Server error — please try again';
      default:  return 'An unexpected error occurred';
    }
  }
}
