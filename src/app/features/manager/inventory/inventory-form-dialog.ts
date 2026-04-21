import { Component, inject } from '@angular/core';
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
  private readonly dialogRef = inject(MatDialogRef<InventoryFormDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data: InventoryDialogData = inject(MAT_DIALOG_DATA);

  readonly isEdit = this.data.item !== null;

  form: FormGroup = this.fb.group({
    name: [this.data.item?.name ?? '', Validators.required],
    quantity: [this.data.item?.quantity ?? 0, [Validators.required, Validators.min(0)]],
    unitPrice: [this.data.item?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
    packageVolume: [this.data.item?.packageVolume ?? 0.01, [Validators.required, Validators.min(0.01)]]
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
