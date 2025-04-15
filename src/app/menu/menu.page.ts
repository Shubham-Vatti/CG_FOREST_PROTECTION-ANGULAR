import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonList,
  IonItem,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './menu-routing.module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenu,
    IonList,
    IonItem,
    IonRouterOutlet,
  ],
})
export class MenuPage implements OnInit {
  pages = [
    {
      title: 'home',
      url: '/menu/home',
    },
    {
      title: 'por',
      url: '/menu/por-form',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
