import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { defineCustomElements } from 'jeep-sqlite/loader'; // ✅ ADD THIS
// import { defineCustomElements } from '@';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { StatusBar } from '@capacitor/status-bar';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
defineCustomElements(window); // ✅ INITIALIZE jeep-sqlite BEFORE APP BOOTSTRAPS

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

// To make sure the status bar doesn't overlap
StatusBar.setOverlaysWebView({ overlay: false });

// Alternatively, you can hide the status bar for certain screens:
StatusBar.show();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(),
    importProvidersFrom(
      IonicModule.forRoot({}),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    // provideCharts(), // <-- IMPORTANT for ng2-charts v8+
  ],
});
