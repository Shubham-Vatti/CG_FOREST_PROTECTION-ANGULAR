import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { defineCustomElements } from 'jeep-sqlite/loader';
import { SQLiteService } from './services/localstorage/sqlite.service';
import { Platform } from '@ionic/angular';
import { defineCustomElements as jeepSqliteLoader } from 'jeep-sqlite/loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private sqliteService: SQLiteService,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  async ngOnInit() {}

  async initializeApp() {
    await this.platform.ready();

    // Load jeep-sqlite for web platform
    if (Capacitor.getPlatform() === 'web') {
      await customElements.whenDefined('jeep-sqlite');
      // await this.sqliteService.in();
    }

    try {
      await this.sqliteService.initializeDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database', error);
    }
  }
}
