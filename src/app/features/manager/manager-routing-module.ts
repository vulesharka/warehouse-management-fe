import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerOrdersListComponent } from './orders-list/orders-list';
import { ManagerOrderDetailComponent } from './order-detail/order-detail';
import { ScheduleDeliveryComponent } from './schedule-delivery/schedule-delivery';
import { InventoryComponent } from './inventory/inventory';
import { TrucksComponent } from './trucks/trucks';

const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'orders', component: ManagerOrdersListComponent },
  { path: 'orders/:id', component: ManagerOrderDetailComponent },
  { path: 'orders/:id/schedule', component: ScheduleDeliveryComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'trucks', component: TrucksComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}
