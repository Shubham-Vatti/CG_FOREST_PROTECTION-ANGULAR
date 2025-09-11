import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'profile-data',
    loadComponent: () =>
      import('./profile-data/profile-data.page').then((m) => m.ProfileDataPage),
  },
  {
    path: 'view-complain-detail',
    loadComponent: () =>
      import('./view-complain-detail/view-complain-detail.page').then(
        (m) => m.ViewComplainDetailPage
      ),
  },
  {
    path: 'ra-work-log',
    loadComponent: () =>
      import('./ra-work-log/ra-work-log.component').then(
        (m) => m.RaWorkLogComponent
      ),
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./testing/testing.component').then((m) => m.TestingComponent),
  },
  {
    path: '',
    redirectTo: 'splash',
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
        path: 'report-section',
        loadComponent: () =>
          import('./pages/report-section/report-section.page').then(
            (m) => m.ReportSectionPage
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
        path: 'por-form-list',
        loadComponent: () =>
          import('../app/pages/por-form-list/por-form-list.component').then(
            (m) => m.PorFormListComponent
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
