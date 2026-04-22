import { Component, Inject } from '@angular/core';
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
  readonly isEdit: boolean;
  form: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<TruckFormDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) readonly data: TruckDialogData
  ) {
    this.isEdit = data.truck !== null;
    this.form = this.fb.group({
      licensePlate: [data.truck?.licensePlate ?? '', Validators.required],
      chassisNumber: [data.truck?.chassisNumber ?? '', Validators.required],
      containerVolume: [data.truck?.containerVolume ?? 1, [Validators.required, Validators.min(0.01)]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
