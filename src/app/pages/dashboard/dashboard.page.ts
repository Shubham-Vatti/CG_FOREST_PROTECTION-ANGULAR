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
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { userdataprops } from 'src/app/profile-data/profile_data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BaseChartDirective,
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
  ],
})
export class DashboardPage implements OnInit {
  totalpor: string = '';
  approvedpor: string = '';
  pendingpor: string = '';
  
  get isChartVisible(): boolean {
  return (
    this.totalpor !== '0' &&
    this.totalpor !== '' &&
    (this.approvedpor !== '0' || this.pendingpor !== '0')
  );
}

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartData = {
    labels: [
      this.translate.instant('dashboard.completedtxt'),
      this.translate.instant('dashboard.pendingtxt'),
    ],
    datasets: [
      {
        data: [this.approvedpor, this.pendingpor],
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
          color: '#000',
        },
      },
    },
  };

  constructor(
    private translate: TranslateService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData: userdataprops = JSON.parse(storedUser);
      this.load_dashboard_Data(
        JSON.stringify({
          emp_id: userData.emp_id,
          designation_id: userData.designation_id,
        })
      );
    } else {
      console.error('User data not found in localStorage');
    }
  }

  async load_dashboard_Data(data: string) {
    this.apiService.Get_Complain_List_Data(data).then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          if (data.response.code === 200) {
            data.totalComplainData.forEach((ele) => {
              switch (ele.whichTypeOfComplain) {
                case '3':
                  this.approvedpor = ele.totalComplain;
                  break;
                case '2':
                  this.pendingpor = ele.totalComplain;
                  break;
                case '1':
                  this.totalpor = ele.totalComplain;
                  break;
              }
            });
          } else {
            console.log('Error in fetching data:', data.response.msg);
            this.resetComplainCounts();
          }
        },
        error: (err) => {
          console.error('Circle API error:', err);
          this.resetComplainCounts();
        },
      });
    });
  }

  private resetComplainCounts() {
    this.totalpor = '0';
    this.approvedpor = '0';
    this.pendingpor = '0';
  }
}
