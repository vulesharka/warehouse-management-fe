import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryApiService } from '../../../shared/services/inventory-api.service';
import { InventoryItemResponse } from '../../../core/models/inventory.model';
import { InventoryFormDialogComponent } from './inventory-form-dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
  standalone: false
})
export class InventoryComponent implements OnInit {
  constructor(
    private readonly inventoryApi: InventoryApiService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {}

  displayedColumns = ['name', 'quantity', 'unitPrice', 'packageVolume', 'actions'];
  items: InventoryItemResponse[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;
    this.inventoryApi.getAll().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Failed to load inventory', 'Close', { duration: 3000 });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openAdd(): void {
    const ref = this.dialog.open(InventoryFormDialogComponent, {
      width: '480px',
      data: { item: null }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.inventoryApi.create(result).subscribe({
        next: () => {
          this.snackBar.open('Item created', 'Close', { duration: 3000 });
          this.loadItems();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to create item', 'Close', { duration: 3000 })
      });
    });
  }

  openEdit(item: InventoryItemResponse): void {
    const ref = this.dialog.open(InventoryFormDialogComponent, {
      width: '480px',
      data: { item }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.inventoryApi.update(item.id, result).subscribe({
        next: () => {
          this.snackBar.open('Item updated', 'Close', { duration: 3000 });
          this.loadItems();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to update item', 'Close', { duration: 3000 })
      });
    });
  }

  deleteItem(id: number): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: { title: 'Delete Item', message: 'Are you sure you want to delete this item? This action cannot be undone.' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.inventoryApi.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Item deleted', 'Close', { duration: 3000 });
          this.loadItems();
        },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to delete', 'Close', { duration: 3000 })
      });
    });
  }
}
