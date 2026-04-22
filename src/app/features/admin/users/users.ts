import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { UserApiService } from '../../../shared/services/user-api.service';
import { UserResponse } from '../../../core/models/user.model';
import { UserFormDialogComponent } from './user-form-dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.scss',
  standalone: false
})
export class UsersComponent implements OnInit {
  constructor(
    private readonly userApi: UserApiService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) {}

  displayedColumns = ['username', 'email', 'role', 'createdAt', 'actions'];
  users: UserResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  readonly roleLabels: Record<string, string | undefined> = {
    CLIENT: 'Client',
    WAREHOUSE_MANAGER: 'Warehouse Manager',
    SYSTEM_ADMIN: 'System Admin'
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.userApi.getAll(this.pageIndex, this.pageSize).subscribe({
      next: (page) => {
        this.users = page.content ?? [];
        this.totalElements = page.totalElements;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  openAdd(): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '480px',
      data: { user: null }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.userApi.create(result).subscribe({
        next: () => { this.pageIndex = 0; this.loadUsers(); }
      });
    });
  }

  openEdit(user: UserResponse): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '480px',
      data: { user }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.userApi.update(user.id, result).subscribe({
        next: () => this.loadUsers()
      });
    });
  }

  deleteUser(user: UserResponse): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '360px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete "${user.username}"? This action cannot be undone.`
      }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.userApi.delete(user.id).subscribe({
        next: () => { this.pageIndex = 0; this.loadUsers(); }
      });
    });
  }
}
