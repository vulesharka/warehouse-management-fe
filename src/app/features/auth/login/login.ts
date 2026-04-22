import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: false
})
export class LoginComponent {
  form: FormGroup;
  forgotForm: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  showForgot = false;
  forgotSent = false;
  forgotError = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.value as LoginRequest).subscribe({
      next: () => this.authService.redirectByRole(),
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  toggleForgot(): void {
    this.showForgot = !this.showForgot;
    this.forgotSent = false;
    this.forgotError = '';
    this.forgotForm.reset();
  }

  sendReset(): void {
    if (this.forgotForm.invalid) return;
    this.forgotError = '';
    this.http.post('/api/auth/forgot-password', this.forgotForm.value).subscribe({
      next: () => { this.forgotSent = true; this.cdr.detectChanges(); },
      error: (err) => { this.forgotError = err.error?.message ?? 'Something went wrong. Please try again.'; this.cdr.detectChanges(); }
    });
  }
}
