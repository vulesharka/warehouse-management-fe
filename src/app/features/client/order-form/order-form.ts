import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderApiService } from '../../../shared/services/order-api.service';
import { InventoryApiService } from '../../../shared/services/inventory-api.service';
import { InventoryItemResponse } from '../../../core/models/inventory.model';
import { OrderRequest } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
  standalone: false
})
export class OrderFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orderApi = inject(OrderApiService);
  private readonly inventoryApi = inject(InventoryApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  inventoryItems: InventoryItemResponse[] = [];
  isEditMode = false;
  orderId: number | null = null;
  loading = false;
  submitting = false;
  readonly today = new Date();

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({ items: this.fb.array([]) });
    this.loadInventory();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.orderId = Number(idParam);
      this.loadOrder(this.orderId);
    } else {
      this.addItem();
    }
  }

  private newItemGroup(): FormGroup {
    return this.fb.group({
      inventoryItemId: [null, Validators.required],
      requestedQuantity: [1, [Validators.required, Validators.min(1)]],
      deadlineDate: [null, Validators.required]
    });
  }

  addItem(): void {
    this.items.push(this.newItemGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  private loadInventory(): void {
    this.inventoryApi.getAll().subscribe({
      next: (items) => this.inventoryItems = items,
      error: () => this.snackBar.open('Failed to load inventory items', 'Close', { duration: 3000 })
    });
  }

  private loadOrder(id: number): void {
    this.loading = true;
    this.orderApi.getMyOrder(id).subscribe({
      next: (order) => {
        order.items.forEach(item => {
          const group = this.newItemGroup();
          const parts = item.deadlineDate.split('-');
          const date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
          group.patchValue({ inventoryItemId: item.inventoryItemId, requestedQuantity: item.requestedQuantity, deadlineDate: date });
          this.items.push(group);
        });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to load order', 'Close', { duration: 3000 });
        this.router.navigate(['/client/orders']);
      }
    });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const request: OrderRequest = {
      items: this.items.value.map((item: any) => ({
        ...item,
        deadlineDate: this.formatDate(new Date(item.deadlineDate))
      }))
    };

    const call = this.isEditMode && this.orderId
      ? this.orderApi.updateOrder(this.orderId, request)
      : this.orderApi.createOrder(request);

    call.subscribe({
      next: () => {
        this.snackBar.open(this.isEditMode ? 'Order updated' : 'Order created', 'Close', { duration: 3000 });
        this.router.navigate(['/client/orders']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Failed to save order', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/client/orders']);
  }
}
