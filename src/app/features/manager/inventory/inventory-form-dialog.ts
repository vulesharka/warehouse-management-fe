import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryItemResponse } from '../../../core/models/inventory.model';

export interface InventoryDialogData {
  item: InventoryItemResponse | null;
}

@Component({
  selector: 'app-inventory-form-dialog',
  templateUrl: './inventory-form-dialog.html',
  standalone: false
})
export class InventoryFormDialogComponent {
  readonly isEdit: boolean;
  form: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<InventoryFormDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) readonly data: InventoryDialogData
  ) {
    this.isEdit = data.item !== null;
    this.form = this.fb.group({
      name: [data.item?.name ?? '', Validators.required],
      quantity: [data.item?.quantity ?? 0, [Validators.required, Validators.min(0)]],
      unitPrice: [data.item?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
      packageVolume: [data.item?.packageVolume ?? 0.01, [Validators.required, Validators.min(0.01)]]
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
