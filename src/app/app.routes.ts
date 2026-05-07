import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { ShellComponent } from './shared/layout/shell.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'orgs',
        loadComponent: () => import('./features/orgs/orgs.page').then((m) => m.OrgsPage),
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/departments/departments.page').then((m) => m.DepartmentsPage),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.page').then((m) => m.UsersPage),
      },
      {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/tickets.page').then((m) => m.TicketsPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage),
      },
      { path: '', redirectTo: 'tickets', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' },
];
