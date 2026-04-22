import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { DeliveryApiService } from '../../../shared/services/delivery-api.service';
import { TruckApiService } from '../../../shared/services/truck-api.service';
import { TruckResponse } from '../../../core/models/truck.model';

@Component({
  selector: 'app-schedule-delivery',
  templateUrl: './schedule-delivery.html',
  styleUrl: './schedule-delivery.scss',
  standalone: false
})
export class ScheduleDeliveryComponent implements OnInit {
  constructor(
    private readonly deliveryApi: DeliveryApiService,
    private readonly truckApi: TruckApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {}

  orderId!: number;
  availableDays: string[] = [];
  trucks: TruckResponse[] = [];
  loading = true;
  daysLoading = false;
  submitting = false;
  form!: FormGroup;
  daysLookup: number | null = null;

  readonly dateFilter = (date: Date | null): boolean => {
    if (!date || this.availableDays.length === 0) return false;
    return this.availableDays.includes(this.formatDate(date));
  };

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      deliveryDate: [null, Validators.required],
      truckIds: [[], Validators.required]
    });
    this.loadInitialData();
  }

  private loadInitialData(): void {
    forkJoin({
      days: this.deliveryApi.getAvailableDays(this.orderId),
      trucks: this.truckApi.getAll(0, 100)
    }).subscribe({
      next: ({ days, trucks }) => {
        this.availableDays = days.availableDays;
        this.trucks = trucks.content;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to load delivery data', 'Close', { duration: 3000 });
        this.router.navigate(['/manager/orders', this.orderId]);
      }
    });
  }

  onDaysChange(value: string): void {
    const days = value ? Number(value) : null;
    if (days !== null && (isNaN(days) || days < 1)) return;
    this.daysLoading = true;
    this.form.get('deliveryDate')!.reset();
    this.deliveryApi.getAvailableDays(this.orderId, days ?? undefined).subscribe({
      next: (res) => {
        this.availableDays = res.availableDays;
        this.daysLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to refresh available days', 'Close', { duration: 3000 });
        this.daysLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const { deliveryDate, truckIds } = this.form.value;
    this.deliveryApi.scheduleDelivery(this.orderId, {
      deliveryDate: this.formatDate(deliveryDate),
      truckIds
    }).subscribe({
      next: () => {
        this.snackBar.open('Delivery scheduled successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/manager/orders']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Failed to schedule delivery', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/manager/orders']);
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
