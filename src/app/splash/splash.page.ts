import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonSpinner,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
import { userdataprops } from '../profile-data/profile_data.model';
import { Capacitor } from '@capacitor/core';
import { MasterDataProps } from 'src/assets/models/reusable.model';
import { SQLiteService } from '../services/localstorage/sqlite.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonSpinner,
    TranslateModule,
  ],
})
export class SplashPage implements OnInit {
  private initializationTimeout: any;
  constructor(private router: Router, private sqliteService: SQLiteService) {}

  async ngOnInit() {
    this.initializationTimeout = setTimeout(() => {
      this.router.navigate(['login']);
    }, 5000);
    try {
      // await this.sqliteService.initializeDatabase();
      const data: MasterDataProps = await this.sqliteService.getOfflineData();
      console.log('--offline-data--', data);
      clearTimeout(this.initializationTimeout);
      if (data.data.length > 0 && data != null) {
        console.log('--navigating-to-menu/dashboard--');
        this.router.navigate(['menu/dashboard']);
      } else {
        console.log('--navigating-to-login--');
        this.router.navigate(['login']);
      }
    } catch (error) {
      console.error('--error--', error);
      clearTimeout(this.initializationTimeout);
      this.router.navigate(['login']);
    }
  }

  ngOnDestroy() {
    // Clean up the timeout to prevent memory leaks
    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
    }
  }
}
