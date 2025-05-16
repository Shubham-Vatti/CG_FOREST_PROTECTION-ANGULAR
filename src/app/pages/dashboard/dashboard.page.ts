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
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
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
    TranslateModule,
    IonGrid,
    IonCol,
    IonRow,
  ],
})
export class DashboardPage implements OnInit {
  constructor(private translate: TranslateService) {}
  public doughnutChartType: ChartType = 'doughnut';
  Completednumber = 20;
  Pendingnumber = 10;
  public doughnutChartData = {
    labels: [
      this.translate.instant('dashboard.completedtxt'),
      this.translate.instant('dashboard.pendingtxt'),
    ],
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

  ngOnInit() {}
}
