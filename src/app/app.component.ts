import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { defineCustomElements } from 'jeep-sqlite/loader';
import { SQLiteService } from './services/localstorage/sqlite.service';
import { Platform } from '@ionic/angular';
import { defineCustomElements as jeepSqliteLoader } from 'jeep-sqlite/loader';
import { TranslateService } from '@ngx-translate/core';

const sqlite = new SQLiteConnection(CapacitorSQLite);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private sqliteService: SQLiteService,
    private platform: Platform,
    private translate: TranslateService
  ) {
    // this.initializeApp();
  }

  async ngOnInit() {
    this.translate.use('en').toPromise();
  }
  async ngOnDestroy() {
    try {
      await this.sqliteService.closeConnection();
    } catch (error) {
      console.error('Error closing database on app destroy:', error);
    }
  }

  async initializeApp() {
    await this.platform.ready();
    // if (Capacitor.getPlatform() === 'web') {
    //   await sqlite.initWebStore();
    // }

    // try {
    //   await this.sqliteService.ensureDbIsOpen();
    //   console.log('Database initialized successfully');
    // } catch (error) {
    //   console.error('Error initializing database', error);
    // }
  }
}
