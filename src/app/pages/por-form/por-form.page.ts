import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-por-form',
  templateUrl: './por-form.page.html',
  styleUrls: ['./por-form.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonImg,
    IonButton,
  ],
})
export class PorFormPage implements OnInit {
  currentDate: string;

  constructor() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Month is zero-based
    const year = today.getFullYear();

    // Format as DD-MM-YYYY
    this.currentDate = `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`;
  }

  ngOnInit() {}
}
