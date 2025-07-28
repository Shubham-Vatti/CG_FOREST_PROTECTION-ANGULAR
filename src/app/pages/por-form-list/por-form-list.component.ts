import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { userdataprops } from 'src/app/profile-data/profile_data.model';
import { ApiService } from 'src/app/services/api.service';
import { PORFormDataprops } from './por-form-list.model';
import { ApproveRejectComponent } from 'src/app/dialogs/approve-reject/approve-reject.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-por-form-list',
  templateUrl: './por-form-list.component.html',
  styleUrls: ['./por-form-list.component.scss'],
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
  ],
})
export class PorFormListComponent implements OnInit {
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
  };
  userdata: userdataprops = {
    emp_id: 0,
    f_name: '',
    l_name: '',
    designation_id: 0,
    user_name: '',
    password: '',
    is_active: 0,
    mobile_number: 0,
    circle_id: 0,
    circle_name: '',
    division_id: 0,
    designation_name: '',
    division_name: '',
    range_id: 0,
    range_name: '',
    beat_id: 0,
    sub_division_id: 0,
    sub_division_name: '',
    is_self_verified: 0,
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  async detailOrAcceptOrReject(
    clickedComplainDetail: PORFormDataprops,
    detailAcceptOrReject: string
  ) {
    let msg = '';

    if (detailAcceptOrReject === '') {
      //console.log("GO TO SEE DETAIL");

      const jsonData = JSON.stringify(clickedComplainDetail);

      this.router.navigateByUrl('/view-complain-detail', {
        state: { data: jsonData },
        replaceUrl: false,
      });

      return;
    } else {
      this.clickedComplainDetail = clickedComplainDetail;

      if (detailAcceptOrReject === '1') {
        msg = 'स्वीकृत टिप्पणी लिखें';
      } else if (detailAcceptOrReject === '2') {
        msg = 'अस्वीकृत टिप्पणी लिखें';
      }
    }

    const modal = await this.modalCtrl.create({
      component: ApproveRejectComponent,
      cssClass: 'custom-dialog-modal',
      componentProps: {
        remarkLabel: msg,
        approved_or_reject: detailAcceptOrReject,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.confirmed) {
        //console.log('ApprroveRejectRemark:', result.data.remark);
        this.approveRejectComplain(
          result.data.remark,
          result.data.approved_or_reject
        );
      }
    });

    await modal.present();
  }

  approveRejectComplain(
    approvedRejectRemark: string,
    approved_or_reject: number
  ) {
    // this.apiService.approveRejectComplain(
    //   this.userdata.emp_id,
    //   approved_or_reject,
    //   approvedRejectRemark,
    //   (this.clickedComplainDetail as PORFormDataprops).complain_history_table_id,
    //   (this.clickedComplainDetail as PORFormDataprops).complain_id,
    // ).subscribe(
    //   async (response:any) => {
    //     this.cdRef.detectChanges;
    //     if (response.response.code === 200) {
    //       this.load_dashboard_Data(
    //     JSON.stringify({
    //       emp_id: this.userdata?.emp_id,
    //       designation_id: this.userdata?.designation_id,
    //     }));
    //     } else {
    //       alert(response.response.msg)
    //     }
    //   },
    //   async (error:any) => {
    //     //await this.dismissLoading();
    //     alert(error);
    //     //this.apiService.showServerMessages(error)
    //   }
    // );
  }

  async load_dashboard_Data(data: string) {
    this.apiService.Get_Complain_List_Data(data).then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          this.localListToFilterComplainDetail = data.complainData;
        },
        error: (err) => {
          console.error('Circle API error:', err);
        },
      });
    });
  }

  on_fab_click() {
    this.router.navigate(['menu/por-form']);
  }
  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userdata = JSON.parse(storedUser);
      this.load_dashboard_Data(
        JSON.stringify({
          emp_id: this.userdata?.emp_id,
          designation_id: this.userdata?.designation_id,
        })
      );
    } else {
      console.error('User data not found in localStorage');
    }
    addIcons({ add });
    this.cdr.detectChanges();
  }
  is_bg(): boolean {
    // console.log(this.userdata.designation_name);
    if (this.userdata.designation_name == 'BG') {
      // console.log('true');
      return true;
    } else {
      // console.log('false');
      return false;
    }
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

  dismissModal() {
    this.modal.dismiss();
  }

  onWillDismiss(event: any) {
    console.log('Modal dismissed', event);
  }
}
