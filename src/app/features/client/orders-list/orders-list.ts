import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { OrderApiService } from '../../../shared/services/order-api.service';
import { OrderSummaryResponse, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss',
  standalone: false
})
export class OrdersListComponent implements OnInit {
  private readonly orderApi = inject(OrderApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns = ['orderNumber', 'status', 'createdAt', 'submittedDate', 'actions'];
  orders: OrderSummaryResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  selectedStatus: OrderStatus | '' = '';
  loading = false;

  readonly statusOptions: OrderStatus[] = [
    'CREATED', 'AWAITING_APPROVAL', 'APPROVED', 'DECLINED',
    'UNDER_DELIVERY', 'FULFILLED', 'CANCELED'
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    const status = this.selectedStatus || undefined;
    this.orderApi.getMyOrders(status as OrderStatus, this.pageIndex, this.pageSize).subscribe({
      next: (page) => {
        this.orders = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onStatusChange(value: OrderStatus | ''): void {
    this.selectedStatus = value;
    this.pageIndex = 0;
    this.loadOrders();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  canEdit(status: OrderStatus): boolean {
    return status === 'CREATED' || status === 'DECLINED';
  }

  canCancel(status: OrderStatus): boolean {
    return ['CREATED', 'AWAITING_APPROVAL', 'APPROVED'].includes(status);
  }

  viewOrder(id: number): void {
    this.router.navigate(['/client/orders', id]);
  }

  editOrder(id: number): void {
    this.router.navigate(['/client/orders', id, 'edit']);
  }

  cancelOrder(id: number): void {
    this.orderApi.cancelOrder(id).subscribe({
      next: () => {
        this.snackBar.open('Order canceled', 'Close', { duration: 3000 });
        this.loadOrders();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Failed to cancel order', 'Close', { duration: 3000 });
      }
    });
  }
}
