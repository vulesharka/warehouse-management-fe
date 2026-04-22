import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DeclineReasonDialogData {
  orderNumber: string;
}

@Component({
  selector: 'app-decline-reason-dialog',
  templateUrl: './decline-reason-dialog.html',
  standalone: false
})
export class DeclineReasonDialogComponent {
  form: FormGroup;

  constructor(
    readonly dialogRef: MatDialogRef<DeclineReasonDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) readonly data: DeclineReasonDialogData
  ) {
    this.form = this.fb.group({ reason: [''] });
  }

  confirm(): void {
    this.dialogRef.close(this.form.value.reason || null);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
