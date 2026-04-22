import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard('ROLE_CLIENT')],
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard('ROLE_WAREHOUSE_MANAGER')],
    loadChildren: () => import('./features/manager/manager-module').then(m => m.ManagerModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('ROLE_SYSTEM_ADMIN')],
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
