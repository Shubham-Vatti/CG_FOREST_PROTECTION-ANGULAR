import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonBackButton,
} from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonButton,
    IonBackButton,
  ],
})
export class DashboardPage implements OnInit {
  constructor() {
    addIcons({ arrowBack });
  }

  ngOnInit() {}
}
