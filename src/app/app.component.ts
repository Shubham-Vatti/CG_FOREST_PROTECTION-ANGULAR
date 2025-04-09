import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';

// To make sure the status bar doesn't overlap
StatusBar.setOverlaysWebView({ overlay: false });

// Alternatively, you can hide the status bar for certain screens:
StatusBar.show();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
