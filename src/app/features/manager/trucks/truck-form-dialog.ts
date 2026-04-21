import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TruckResponse } from '../../../core/models/truck.model';

export interface TruckDialogData {
  truck: TruckResponse | null;
}

@Component({
  selector: 'app-truck-form-dialog',
  templateUrl: './truck-form-dialog.html',
  standalone: false
})
export class TruckFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<TruckFormDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data: TruckDialogData = inject(MAT_DIALOG_DATA);

  readonly isEdit = this.data.truck !== null;

  form: FormGroup = this.fb.group({
    licensePlate: [this.data.truck?.licensePlate ?? '', Validators.required],
    chassisNumber: [this.data.truck?.chassisNumber ?? '', Validators.required],
    containerVolume: [this.data.truck?.containerVolume ?? 1, [Validators.required, Validators.min(0.01)]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
