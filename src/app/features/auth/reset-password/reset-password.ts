import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;
  token = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorMessage = 'Invalid reset link. Please request a new one.';
    }
  }

  private passwordsMatch(group: FormGroup): { mismatch: true } | null {
    const pw = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pw === confirm ? null : { mismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;
    this.errorMessage = '';

    this.http.post('/api/auth/reset-password', {
      token: this.token,
      newPassword: this.form.value.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Your password has been reset successfully. You can now log in.';
        this.form.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Reset failed. The link may have expired.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
