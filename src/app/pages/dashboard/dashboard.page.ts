import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
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
    IonButtons,
    IonMenuButton,
    BaseChartDirective,
    IonImg,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
  ],
})
export class DashboardPage implements OnInit {
  public doughnutChartType: ChartType = 'doughnut';
  Completednumber = 20;
  Pendingnumber = 10;
  public doughnutChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [this.Completednumber, this.Pendingnumber],
        backgroundColor: ['#92e67a', '#008001'],
        hoverBackgroundColor: ['lightgreen', 'green'],
      },
    ],
  };

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#000', // for dark/light mode compatibility
        },
      },
    },
  };
  constructor() {}

  ngOnInit() {}
}
