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
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 2000);
  }

  async ngOnInit() {

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData: userdataprops = JSON.parse(storedUser);
          console.log('User data found in localStorage:', userData);
              this.router.navigate(['menu/dashboard']);
          // this.load_dashboard_Data(
          //   JSON.stringify({
          //     emp_id: userData.emp_id,
          //     designation_id: userData.designation_id,
          //   })
          // );
        } else {
          console.error('User data not found in localStorage');
        }
  }
}
