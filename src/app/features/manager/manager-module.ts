import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ManagerRoutingModule } from './manager-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { ManagerOrdersListComponent } from './orders-list/orders-list';
import { DeclineReasonDialogComponent } from './orders-list/decline-reason-dialog';
import { ManagerOrderDetailComponent } from './order-detail/order-detail';
import { ScheduleDeliveryComponent } from './schedule-delivery/schedule-delivery';
import { InventoryComponent } from './inventory/inventory';
import { InventoryFormDialogComponent } from './inventory/inventory-form-dialog';
import { TrucksComponent } from './trucks/trucks';
import { TruckFormDialogComponent } from './trucks/truck-form-dialog';

@NgModule({
  declarations: [
    ManagerOrdersListComponent,
    DeclineReasonDialogComponent,
    ManagerOrderDetailComponent,
    ScheduleDeliveryComponent,
    InventoryComponent,
    InventoryFormDialogComponent,
    TrucksComponent,
    TruckFormDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ManagerRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ]
})
export class ManagerModule {}
