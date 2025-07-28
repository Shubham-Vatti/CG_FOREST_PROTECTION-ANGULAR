import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { userdataprops } from 'src/app/profile-data/profile_data.model';
import { LoaderService } from 'src/app/services/loader.service';
import { SQLiteService } from 'src/app/services/localstorage/sqlite.service';
import { MasterDataProps } from 'src/assets/models/reusable.model';
Chart.register(...registerables); // Add this

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
  userstoredData!: MasterDataProps;

  updateChartData() {
    this.doughnutChartData = {
      labels:
        this.userstoredData.data[0].designation_name == 'BG'
          ? [this.translate.instant('dashboard.completedtxt')]
          : [
              this.translate.instant('dashboard.completedtxt'),
              this.translate.instant('dashboard.pendingtxt'),
            ],
      datasets: [
        {
          data:
            this.userstoredData.data[0].designation_name == 'BG'
              ? [this.totalpor || '0']
              : [this.approvedpor || '0', this.pendingpor || '0'],
          backgroundColor:
            this.userstoredData.data[0].designation_name == 'BG'
              ? ['#008001']
              : ['#008001', '#92e67a'],
          hoverBackgroundColor:
            this.userstoredData.data[0].designation_name == 'BG'
              ? ['green']
              : ['green', 'lightgreen'],
        },
      ],
    };
  }

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
        data: !this.isBG
          ? [this.totalpor]
          : [this.approvedpor, this.pendingpor],
        backgroundColor: ['#008001', '#92e67a'],
        hoverBackgroundColor: ['green', 'lightgreen'],
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
    private apiService: ApiService,
    private cdr: ChangeDetectorRef, // add this
    private loader: LoaderService, // <-- inject loader service
    private sqliteService: SQLiteService
  ) {}

  ngOnInit() {
    this.showStoredUser();
    this.cdr.detectChanges();
  }

  async showStoredUser() {
    const data: MasterDataProps = await this.sqliteService.getOfflineData();
    console.log('🔍 Full Offline Data:', data);
    this.userstoredData = data;
    this.load_dashboard_Data(
      JSON.stringify({
        emp_id: data.data[0].emp_id,
        designation_id: data.data[0].designation_id,
      })
    );
    this.updateChartData(); // Initialize chart
  }
  get isBG(): boolean {
    return this.userstoredData?.data[0]?.designation_name === 'BG';
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
                  console.log('inside approved por');
                  break;
                case '2':
                  this.pendingpor = ele.totalComplain;
                  console.log('inside pending por');
                  break;
                case '1':
                  this.totalpor = ele.totalComplain;
                  console.log('inside total por');
                  break;
              }
            });
            this.updateChartData();
            this.loader.hide();
          } else {
            console.log('Error in fetching data:', data.response.msg);
            this.resetComplainCounts();
            this.updateChartData(); // ADD THIS
            this.loader.hide();
          }
        },
        error: (err) => {
          console.error('Circle API error:', err);
          this.resetComplainCounts();
          this.updateChartData(); // ADD THIS
          this.loader.hide();
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
