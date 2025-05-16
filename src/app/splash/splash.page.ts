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
    }, 1000);
  }

  async ngOnInit() {}
}
