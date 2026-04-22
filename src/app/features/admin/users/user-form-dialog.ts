import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserResponse } from '../../../core/models/user.model';

export interface UserDialogData {
  user: UserResponse | null;
}

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.html',
  standalone: false
})
export class UserFormDialogComponent implements OnInit {
  readonly roles = [
    { value: 'CLIENT', label: 'Client' },
    { value: 'WAREHOUSE_MANAGER', label: 'Warehouse Manager' },
    { value: 'SYSTEM_ADMIN', label: 'System Admin' }
  ];

  isEdit = false;
  hidePassword = true;
  form: FormGroup;

  constructor(
    readonly dialogRef: MatDialogRef<UserFormDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) readonly data: UserDialogData
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['CLIENT', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.isEdit = true;
      this.form.patchValue({
        username: this.data.user.username,
        email: this.data.user.email,
        role: this.data.user.role
      });
      this.form.get('password')!.clearValidators();
      this.form.get('password')!.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    const request: any = {
      username: value.username,
      email: value.email,
      role: value.role
    };
    if (value.password) request.password = value.password;
    this.dialogRef.close(request);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
