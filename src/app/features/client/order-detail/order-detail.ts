import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderApiService } from '../../../shared/services/order-api.service';
import { OrderResponse } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
  standalone: false
})
export class OrderDetailComponent implements OnInit {
  constructor(
    private readonly orderApi: OrderApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  order: OrderResponse | null = null;
  loading = false;

  get canSubmit(): boolean {
    return this.order?.status === 'CREATED' || this.order?.status === 'DECLINED';
  }

  get canEdit(): boolean {
    return this.order?.status === 'CREATED' || this.order?.status === 'DECLINED';
  }

  get canCancel(): boolean {
    return ['CREATED', 'AWAITING_APPROVAL', 'APPROVED'].includes(this.order?.status ?? '');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder(id);
  }

  private loadOrder(id: number): void {
    this.loading = true;
    this.orderApi.getMyOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Order not found', 'Close', { duration: 3000 });
        this.router.navigate(['/client/orders']);
      }
    });
  }

  submitOrder(): void {
    this.orderApi.submitOrder(this.order!.id).subscribe({
      next: () => {
        this.snackBar.open('Order submitted for approval', 'Close', { duration: 3000 });
        this.router.navigate(['/client/orders']);
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to submit', 'Close', { duration: 3000 })
    });
  }

  cancelOrder(): void {
    this.orderApi.cancelOrder(this.order!.id).subscribe({
      next: (updated) => {
        this.order = updated;
        this.snackBar.open('Order canceled', 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to cancel', 'Close', { duration: 3000 })
    });
  }

  editOrder(): void {
    this.router.navigate(['/client/orders', this.order!.id, 'edit']);
  }

  back(): void {
    this.router.navigate(['/client/orders']);
  }
}
