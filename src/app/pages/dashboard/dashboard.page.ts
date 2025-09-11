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
  IonMenu,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SQLiteService } from 'src/app/services/localstorage/sqlite.service';
import { MasterDataProps } from 'src/assets/models/reusable.model';
import { NetworkService } from 'src/app/services/internetnetwork/network.service';
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
    IonMenu,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class DashboardPage implements OnInit {
  totalpor: string = '';
  approvedpor: string = '';
  pendingpor: string = '';
  userstoredData!: MasterDataProps;
  isLoading: boolean = false;
  loadingMessage: string = '';
  dismissDialog() {
    this.isLoading = false;
    this.cdRef.detectChanges();
    if (this.refreshEvent != null) {
      this.refreshEvent.target.complete(); // Stop the loading spinner
    }
  }

  refreshEvent: any;
  async doRefresh(event: any) {
    if (await this.networkservice.getCurrentStatus()) {
      this.refreshEvent = event;
      this.load_dashboard_Data(
        JSON.stringify({
          emp_id: this.userstoredData?.data[0]?.emp_id,
          designation_id: this.userstoredData?.data[0]?.designation_id,
        })
      );
    } else {
      this.refreshEvent.target.complete(); // Stop the loading spinner
    }
  }

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
    private sqliteService: SQLiteService, // private translateService:Transs
    private networkservice: NetworkService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.showStoredUser();
    this.cdr.detectChanges();
  }

  async showStoredUser() {
    this.loader.show(this.translate.instant('dashboard.D-Loadertxt'));
    const data: MasterDataProps = await this.sqliteService.getOfflineData();
    console.log('🔍 Full Offline Data:', data);
    this.userstoredData = data;
    if (await this.networkservice.getCurrentStatus()) {
      this.load_dashboard_Data(
        JSON.stringify({
          emp_id: data.data[0].emp_id,
          designation_id: data.data[0].designation_id,
        })
      );
    } else {
      this.updateChartData(); // Initialize chart
      // this.updateChartData(); // ADD THIS
      this.loader.hide();
    }
  }
  get isBG(): boolean {
    return this.userstoredData?.data[0]?.designation_name === 'BG';
  }

  async load_dashboard_Data(data: string) {
    try {
      if (await this.networkservice.getCurrentStatus()) {
        this.apiService
          .Get_Complain_List_Data(data)
          .then((circleObservable) => {
            circleObservable.subscribe({
              next: (data) => {
                this.dismissDialog();
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
                this.dismissDialog();
                console.error('Circle API error:', err);
                this.resetComplainCounts();
                this.updateChartData(); // ADD THIS
                this.loader.hide();
              },
            });
          });
      } else {
        this.resetComplainCounts();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  private resetComplainCounts() {
    this.totalpor = '0';
    this.approvedpor = '0';
    this.pendingpor = '0';
  }
}
