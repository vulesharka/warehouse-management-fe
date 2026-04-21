import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderApiService } from '../../../shared/services/order-api.service';
import { OrderResponse } from '../../../core/models/order.model';

@Component({
  selector: 'app-manager-order-detail',
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
  standalone: false
})
export class ManagerOrderDetailComponent implements OnInit {
  private readonly orderApi = inject(OrderApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  order: OrderResponse | null = null;
  loading = false;
  submitting = false;
  showDeclineForm = false;
  declineReason = '';

  get canApproveDecline(): boolean {
    return this.order?.status === 'AWAITING_APPROVAL';
  }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder(id);
  }

  private loadOrder(id: number): void {
    this.loading = true;
    this.orderApi.getOrderDetail(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Order not found', 'Close', { duration: 3000 });
        this.router.navigate(['/manager/orders']);
      }
    });
  }

  approveOrder(): void {
    this.submitting = true;
    this.orderApi.approveOrder(this.order!.id).subscribe({
      next: () => {
        this.snackBar.open('Order approved', 'Close', { duration: 3000 });
        this.router.navigate(['/manager/orders']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Failed to approve', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  toggleDeclineForm(): void {
    this.showDeclineForm = !this.showDeclineForm;
    if (!this.showDeclineForm) this.declineReason = '';
  }

  confirmDecline(): void {
    this.submitting = true;
    this.orderApi.declineOrder(this.order!.id, this.declineReason || undefined).subscribe({
      next: () => {
        this.snackBar.open('Order declined', 'Close', { duration: 3000 });
        this.router.navigate(['/manager/orders']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Failed to decline', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/manager/orders']);
  }
}
