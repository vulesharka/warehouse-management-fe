import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { TruckApiService } from '../../../shared/services/truck-api.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { TruckFormDialogComponent } from './truck-form-dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.html',
  styleUrl: './trucks.scss',
  standalone: false
})
export class TrucksComponent implements OnInit {
  constructor(
    private readonly truckApi: TruckApiService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  displayedColumns = ['licensePlate', 'chassisNumber', 'containerVolume', 'actions'];
  trucks: TruckResponse[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  loading = false;

  ngOnInit(): void {
    this.loadTrucks();
  }

  private loadTrucks(): void {
    this.loading = true;
    this.truckApi.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (page) => {
        this.trucks = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to load trucks', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTrucks();
  }

  openAdd(): void {
    const ref = this.dialog.open(TruckFormDialogComponent, {
      width: '420px',
      data: { truck: null }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.truckApi.create(result).subscribe({
        next: () => {
          this.snackBar.open('Truck added', 'Close', { duration: 3000 });
          this.loadTrucks();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to add truck', 'Close', { duration: 3000 })
      });
    });
  }

  openEdit(truck: TruckResponse): void {
    const ref = this.dialog.open(TruckFormDialogComponent, {
      width: '420px',
      data: { truck }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.truckApi.update(truck.id, result).subscribe({
        next: () => {
          this.snackBar.open('Truck updated', 'Close', { duration: 3000 });
          this.loadTrucks();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to update truck', 'Close', { duration: 3000 })
      });
    });
  }

  deleteTruck(id: number): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { title: 'Delete Truck', message: 'Are you sure you want to delete this truck? This action cannot be undone.' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.truckApi.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Truck deleted', 'Close', { duration: 3000 });
          this.loadTrucks();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to delete truck', 'Close', { duration: 3000 })
      });
    });
  }
}
