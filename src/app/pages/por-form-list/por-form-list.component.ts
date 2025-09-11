import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
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
  IonDatetime,
  IonModal,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonFabButton,
  IonFab,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  AlertController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  add,
  cloudOffline,
  documentTextOutline,
  ellipse,
  eye,
  eyeOutline,
  folderOpenOutline,
  peopleOutline,
  personAddOutline,
  personOutline,
  receiptOutline,
  sync,
  timeOutline,
} from 'ionicons/icons';
import { ApiService } from 'src/app/services/api.service';
import { PORFormDataprops } from './por-form-list.model';
import { ApproveRejectComponent } from 'src/app/dialogs/approve-reject/approve-reject.component';
import { Router } from '@angular/router';
import { MasterDataProps } from 'src/assets/models/reusable.model';
import { LoaderService } from 'src/app/services/loader.service';
import { SQLiteService } from 'src/app/services/localstorage/sqlite.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AssignRAResponseModel } from '../por-form/por-form.model';
import { NetworkService } from 'src/app/services/internetnetwork/network.service';
import { SharedserviceService } from 'src/app/services/sharedService/sharedservice.service';

@Component({
  selector: 'app-por-form-list',
  templateUrl: './por-form-list.component.html',
  styleUrls: ['./por-form-list.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButtons,
    IonMenuButton,
    IonImg,
    IonButton,
    IonDatetime,
    IonModal,
    IonItem,
    IonLabel,
    IonList,
    TranslateModule,
    IonIcon,
    IonFabButton,
    IonFab,
    IonText,
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSelect,
    FormsModule,
    IonRefresher,
    IonRefresherContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PorFormListComponent implements OnInit {
  @ViewChild('raOfficerModal') raOfficerModal!: IonModal;
  Current_Ra_Click_Data!: any;
  isOffline: boolean = false;

  async openModal(item: any) {
    this.Current_Ra_Click_Data = item;
    await this.raOfficerModal.present();
  }

  dismissModal() {
    this.raOfficerModal.dismiss();
    this.SelectedRa = null;
    this.ro_remark = '';
  }

  raOfficerList = [
    {
      emp_id: 118,
      empName: 'North Dhamtari RA Sir',
      mobile_number: '',
    },
    {
      emp_id: 119,
      empName: 'South Dhamtari RA Sir',
      mobile_number: '',
    },
    {
      emp_id: 120,
      empName: 'Kurud RA Sir',
      mobile_number: '',
    },
  ];

  localListToFilterComplainDetail: PORFormDataprops[] = [];
  clickedComplainDetail: PORFormDataprops = {
    complain_id: '',
    beat_name: '',
    transferd_to: '',
    complain_history_table_id: '',
    complain_status: '',
    complain_status_text: '',
    current_stage: '',
    stage_name: '',
    accused_name: '',
    accused_fathers_name: '',
    cast_name: '',
    crime_type: '',
    accused_address: '',
    type_of_crime: '',
    place_of_crime: '',
    date_of_crime: '',
    details_of_seized_goods: '',
    name_of_witness_one: '',
    name_of_witness_two: '',
    show_approve_reject_button: '',
    lat: '',
    lng: '',
    map_address: '',
    imageUrl: '',
    all_image_name: '',
    address_of_witness_one: '',
    address_of_witness_two: '',
    button_text: '',
    complain_progress_stage: '',
    por_number: '',
    compartment_number: '',
    crime_dhara: '',
    left_days_to_resolve_por: '',
    japtSamanList: [
      {
        jabti_saman_type: '',
        saman_table_id: '',
        prajati_name: '',
        prajati_type: '',
        lambai: '',
        golai: '',
        ghan_meter: '',
        nag: '',
        dar: '',
        total_cost: '',
        if_other_then_detail: '',
      },
    ],
    isOffline: undefined,
    is_accused_found: 0,
  };
  listOfRA: any;
  userdata!: any;
  SelectedRa!: any;
  selectedRAId: any = null;
  ro_remark: string = '';
  isLoading: boolean = false;
  loadingMessage: string = '';

  @Input() complain_table_id!: string;
  @Input() complain_history_table_id!: string;
  @Input() loginedOffierEmpId!: string;
  @Input() loginedOffierDesignationId!: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private loader: LoaderService,
    private sqliteService: SQLiteService,
    private networkservice: NetworkService,
    private sharedService: SharedserviceService,
    private alertController: AlertController
  ) {}

  async detailOrAcceptOrReject(clickedComplainDetail: PORFormDataprops) {
    if (clickedComplainDetail.isOffline) {
      const jsonData = JSON.stringify(clickedComplainDetail);
      this.router.navigateByUrl('/menu/por-form', {
        state: { data: jsonData },
        replaceUrl: false,
      });
      return;
    } else {
      const jsonData = JSON.stringify(clickedComplainDetail);
      this.router.navigateByUrl('/view-complain-detail', {
        state: { data: jsonData },
        replaceUrl: false,
      });
      return;
    }
  }

  approveRejectComplain(
    approvedRejectRemark: string,
    approved_or_reject: number
  ) {
    // Implementation for approve/reject functionality
    console.log('Approve/Reject:', approvedRejectRemark, approved_or_reject);
  }

  // Simplified offline data loading
  async loadOfflineData() {
    try {
      console.log('Loading offline crime reports...');
      const offlineReports = await this.sqliteService.getOfflineCrimeReports();

      if (offlineReports && offlineReports.length > 0) {
        const offlineComplains = this.convertOfflineToPORData(offlineReports);
        this.mergeData(offlineComplains);
      } else {
        this.localListToFilterComplainDetail = [];
      }

      this.dismissDialog();
    } catch (error) {
      console.error('Error loading offline data:', error);
      this.dismissDialog();
    }
  }

  // Convert offline data to POR format
  private convertOfflineToPORData(offlineReports: any[]): PORFormDataprops[] {
    return offlineReports.map((report) => ({
      complain_id: report.id,
      beat_name: report.beat_name || 'Offline Report',
      transferd_to: '',
      complain_history_table_id: '',
      complain_status: 'pending',
      complain_status_text: 'Pending Sync',
      current_stage: 'offline',
      stage_name: 'Offline',
      accused_name: report.accused_name,
      accused_fathers_name: report.accused_fathers_name,
      cast_name: report.cast_name || '',
      crime_type: report.type_of_crime || '',
      accused_address: report.accused_address,
      type_of_crime: report.type_of_crime,
      place_of_crime: report.place_of_crime,
      date_of_crime: report.date_of_crime,
      details_of_seized_goods: report.details_of_seized_goods,
      name_of_witness_one: report.name_of_witness_one,
      name_of_witness_two: report.name_of_witness_two,
      show_approve_reject_button: '0',
      lat: report.lat,
      lng: report.lng,
      map_address: report.map_address,
      imageUrl: '',
      all_image_name: '',
      address_of_witness_one: report.address_of_witness_one,
      address_of_witness_two: report.address_of_witness_two,
      button_text: 'Sync Pending',
      complain_progress_stage: 'offline',
      por_number: report.por_number,
      compartment_number: report.compartment_number,
      crime_dhara: report.crime_dhara,
      left_days_to_resolve_por: '',
      japtSamanList:
        report.seized_goods?.map((good: any) => ({
          jabti_saman_type: good.jabti_saman_type,
          saman_table_id: good.id,
          prajati_name: good.prajati_name || '',
          prajati_type: good.prajati_type,
          lambai: good.lambai,
          golai: good.golai,
          ghan_meter: good.ghan_meter,
          nag: good.nag,
          dar: good.dar,
          total_cost: good.total_cost,
          if_other_then_detail: good.if_other_then_detail,
        })) || [],
      isOffline: true,
      offlineId: report.id,
      created_at: report.created_at,
      is_accused_found:
        typeof report.is_accused_found !== 'undefined'
          ? report.is_accused_found
          : 0,
    }));
  }

  private mergeData(offlineComplains: PORFormDataprops[]) {
    // Create a map of existing API complain IDs for quick lookup
    const apiComplainIds = new Set(
      this.localListToFilterComplainDetail
        .filter((item) => !item.isOffline)
        .map((item) => item.complain_id?.toString()) // Ensure it's a string
    );

    // Filter out offline items that might already exist in API data
    const newOfflineData = offlineComplains.filter((offlineItem) => {
      // Ensure complain_id is treated as a string
      const complainId = offlineItem.complain_id?.toString() || '';
      // Remove 'offline_' prefix if it exists for comparison
      const cleanComplainId = complainId.replace('offline_', '');
      return !apiComplainIds.has(cleanComplainId);
    });

    // Remove any existing offline data to avoid duplicates
    this.localListToFilterComplainDetail =
      this.localListToFilterComplainDetail.filter((item) => !item.isOffline);

    // Sort offline data by creation date (newest first)
    newOfflineData.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    // Prepend offline data to the beginning
    this.localListToFilterComplainDetail = [
      ...newOfflineData,
      ...this.localListToFilterComplainDetail,
    ];

    this.cdRef.detectChanges();
  }

  async load_dashboard_Data(data: string) {
    try {
      this.isLoading = true;
      const circleObservable = await this.apiService.Get_Complain_List_Data(
        data
      );

      circleObservable.subscribe({
        next: async (data) => {
          this.localListToFilterComplainDetail = data.complainData || [];

          // Load offline data after API data is loaded
          const offlineReports =
            await this.sqliteService.getOfflineCrimeReports();
          if (offlineReports && offlineReports.length > 0) {
            const offlineComplains =
              this.convertOfflineToPORData(offlineReports);
            this.mergeData(offlineComplains);
          }

          this.dismissDialog();
        },
        error: (err) => {
          console.error('Circle API error:', err);
          // If API fails, load only offline data
          this.loadOfflineData();
        },
      });
    } catch (error) {
      console.error('Error in load_dashboard_Data:', error);
      this.loadOfflineData();
    }
  }

  on_fab_click() {
    this.router.navigate(['menu/por-form']);
  }

  async getRAList(data: any) {
    this.loader.show('कृपया प्रतीक्षा करें.....');
    try {
      const raRes = await this.apiService.getRAList(data);
      raRes.subscribe({
        next: (response) => {
          this.loader.hide();
          if (response.response.code === 200) {
            this.listOfRA = response.data;
            this.cdRef.detectChanges();
          } else {
            console.error('RA List Error:', response.response.msg);
          }
        },
        error: (err) => {
          this.loader.hide();
          console.error('RA List Catch Error:', err);
        },
      });
    } catch (error) {
      this.loader.hide();
      console.error('RA List Exception:', error);
    }
  }

  getStatusClass(stageName: string): string {
    if (!stageName) return 'status-default';
    return 'status-' + stageName.toLowerCase().replace(/\s+/g, '-');
  }

  navigateToRaWorkLog(item: any) {
    this.router.navigateByUrl('/ra-work-log', {
      state: { data: item },
      replaceUrl: false,
    });
  }

  async clickToAssignRA() {
    if (this.SelectedRa === null) {
      alert('कृपया RA चुने');
      return;
    }

    let assignra_data = {
      complain_history_table_id:
        this.Current_Ra_Click_Data.complain_history_table_id.toString(),
      complain_table_id: this.Current_Ra_Click_Data.complain_id.toString(),
      ro_id: this.userdata?.data[0]?.emp_id.toString(),
      ra_id: this.SelectedRa.emp_id.toString(),
      remark: this.ro_remark,
    };

    this.loader.show('Assigning Ra');
    try {
      const response = (await (
        await this.apiService.AssignRA(JSON.stringify(assignra_data))
      ).toPromise()) as AssignRAResponseModel;

      this.loader.hide();
      if (response.response.code === 200) {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'RA assigned successfully',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.load_dashboard_Data(
                  JSON.stringify({
                    emp_id: this.userdata?.data[0]?.emp_id,
                    designation_id: this.userdata?.data[0]?.designation_id,
                  })
                );
                this.dismissModal();
              },
            },
          ],
        });
        await alert.present();
      } else {
        alert(response.response.msg);
      }
    } catch (error) {
      this.loader.hide();
      console.error('Assign RA Error:', error);
      alert('Error assigning RA');
    }
  }

  dismissDialog() {
    this.isLoading = false;
    if (this.refreshEvent) {
      this.refreshEvent.target.complete();
    }
    this.cdRef.detectChanges();
  }

  refreshEvent: any;
  async doRefresh(event: any) {
    this.refreshEvent = event;

    if (await this.networkservice.getCurrentStatus()) {
      this.load_dashboard_Data(
        JSON.stringify({
          emp_id: this.userdata?.data[0]?.emp_id,
          designation_id: this.userdata?.data[0]?.designation_id,
        })
      );
    } else {
      this.loadOfflineData();
    }
  }

  async ionViewWillEnter() {
    if (this.sharedService.getRefresh()) {
      await this.loadData();
      this.sharedService.setRefresh(false);
    } else {
      await this.loadData();
    }
  }

  async SubmitOfflineData(data: any) {
    console.log('--Submitting offline data--', data);
    // if (this.isOffline) {
    // this.isOffline = false;
    // if (await this.networkservice.getCurrentStatus()) {
    //   this.load_dashboard_Data(
    //     JSON.stringify({
    //       emp_id: this.userdata?.data[0]?.emp_id,
    //       designation_id: this.userdata?.data[0]?.designation_id,
    //     })
    //   );
    // } else {
    //   this.loadOfflineData();
    // }
  }

  private async loadData() {
    if (await this.networkservice.getCurrentStatus()) {
      this.load_dashboard_Data(
        JSON.stringify({
          emp_id: this.userdata?.data[0]?.emp_id,
          designation_id: this.userdata?.data[0]?.designation_id,
        })
      );
    } else {
      this.loadOfflineData();
    }
  }

  async ngOnInit() {
    try {
      this.userdata =
        (await this.sqliteService.getOfflineData()) as MasterDataProps;

      if (this.userdata) {
        await this.loadData();

        if (await this.networkservice.getCurrentStatus()) {
          this.getRAList(
            JSON.stringify({
              emp_id: this.userdata?.data[0]?.emp_id,
              designation_id: this.userdata?.data[0]?.designation_id,
            })
          );
        }
      } else {
        console.error('User data not found');
        this.loadOfflineData();
      }
    } catch (error) {
      console.error('Initialization error:', error);
      this.loadOfflineData();
    }

    addIcons({
      add,
      documentTextOutline,
      ellipse,
      timeOutline,
      peopleOutline,
      receiptOutline,
      cloudOffline,
      eyeOutline,
      personOutline,
      eye,
      personAddOutline,
      folderOpenOutline,
      sync,
    });
  }

  offlineIconClick() {
    alert('Offline icon clicked');
  }

  is_bg(): boolean {
    return this.userdata?.data[0]?.designation_name == 'BG';
  }

  @ViewChild(IonModal) modal!: IonModal;
  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: any) {
    console.log('Modal dismissed', event);
  }
}
