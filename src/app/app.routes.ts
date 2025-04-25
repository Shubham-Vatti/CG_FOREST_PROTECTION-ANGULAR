import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../app/pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'por-form',
        loadComponent: () =>
          import('../app/pages/por-form/por-form.page').then(
            (m) => m.PorFormPage
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
