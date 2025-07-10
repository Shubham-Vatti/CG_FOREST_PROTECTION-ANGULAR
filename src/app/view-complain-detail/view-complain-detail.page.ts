import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTextarea, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

// import { LanguageServiceService } from 'src/app/services/languageServices/language-service.service';

import { NavController, ModalController } from '@ionic/angular/standalone';
// import { ComplainDetails } from '../officer-dashboard/GetDashboardResponse.model';

import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { arrowBack, calendarOutline, cameraOutline, checkmarkCircleOutline, closeCircle, closeCircleOutline, locationOutline, mapOutline, refreshCircleOutline } from 'ionicons/icons';
import { ApproveRejectComponent } from 'src/app/dialogs/approve-reject/approve-reject.component';

// import { ApiServiceService } from 'src/app/services/apiServices/api-service.service';
import { Toast } from '@capacitor/toast';
// import { Preferences } from '@capacitor/preferences';
// import { PreferenceKeys } from 'src/app/constants/PreferenceKeys';
// import { Users } from '../login-officer/OfficerLoginResponse';

import { SharedserviceService } from 'src/app/services/sharedService/sharedservice.service';
import { AlertController } from '@ionic/angular';
import { ImagePreviewModalComponent } from 'src/app/dialogs/image-preview-modal/image-preview-modal.component';
import { ApiService } from '../services/api.service';
import { PORFormDataprops } from '../pages/por-form-list/por-form-list.model';
import { UserLoginResponse } from '../login/login_response.model';

@Component({
  selector: 'app-view-complain-detail',
  templateUrl: './view-complain-detail.page.html',
  styleUrls: ['./view-complain-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ViewComplainDetailPage implements OnInit {

  photos: string[] = [];
  imageBaseUrl: string = 'https://6975-117-254-215-10.ngrok-free.app/uploads/';

  isLoading: boolean = false;
  loadingMessage: string = 'Please wait.....';

  lat: string = "0"; lon: string = "0";
  complain_location_google_addres: string = "";
  accussedName: string = ""; accussedFatherName: string = ""; address: string = "";
  accussedCast: string = ""; crimType: string = "";
  crimeDate: string = "";
  witness: string = ""; crimePlace: string = "";
  seizedGoodDetail: string = "";

  comingComplaintData!: PORFormDataprops;
  is_pending = false;
  constructor(private alertCtrl: AlertController, private sharedService: SharedserviceService, private cdRef: ChangeDetectorRef, private apiService: ApiService, private modalCtrl: ModalController, private router: Router, private navController: NavController) {
    addIcons({ mapOutline, closeCircle, cameraOutline, arrowBack, locationOutline, refreshCircleOutline, calendarOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  async ngOnInit() {

    this.getLoginedOfficerDetail();

    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state?.['data'];

    if (data) {
      // Convert plain object back to model
      this.comingComplaintData = JSON.parse(data) as PORFormDataprops;


      this.accussedName = this.comingComplaintData.accused_name;
      this.accussedFatherName = this.comingComplaintData.accused_fathers_name;
      this.address = this.comingComplaintData.accused_address;
      this.accussedCast = this.comingComplaintData.cast_name;
      this.crimType = this.comingComplaintData.crime_type;
      this.crimeDate = this.comingComplaintData.date_of_crime;
      this.witness = this.comingComplaintData.name_of_witness;
      this.crimePlace = this.comingComplaintData.place_of_crime;
      this.seizedGoodDetail = this.comingComplaintData.details_of_seized_goods;
      this.lat = this.comingComplaintData.lat;
      this.lon = this.comingComplaintData.lng;
      this.complain_location_google_addres = this.comingComplaintData.map_address;

      if (this.comingComplaintData.show_approve_reject_button === "1") {
        this.is_pending = true;
      } else {
        this.is_pending = false;
      }

      // if (this.comingComplaintData.all_image_name && this.comingComplaintData.all_image_name.trim() !== '') {
      //   this.photos = this.comingComplaintData.all_image_name
      //     .split(',')
      //     .filter(name => name.trim() !== '')
      //     .map(name => this.imageBaseUrl + name.trim());
      // }

    }
  }

  goBack() {
    this.navController.back();
  }

  openMap() {

    const lat = this.lat;
    const lng = this.lon;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_system'); // '_system' works in Cordova/Capacitor apps

  }

  async approveOrReject(approveOrReject: string) {

    let msg = "";

    if (approveOrReject === "1") {
      msg = "स्वीकृत टिप्पणी लिखें";
    } else if (approveOrReject === "2") {
      msg = "अस्वीकृत टिप्पणी लिखें";
    }

    const modal = await this.modalCtrl.create({
      component: ApproveRejectComponent,
      cssClass: 'custom-dialog-modal',
      componentProps: {
        remarkLabel: msg,
        approved_or_reject: approveOrReject
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.confirmed) {
        this.approveRejectComplain(result.data.remark, result.data.approved_or_reject);
      }
    });

    await modal.present();

  }

  approveRejectComplain(approvedRejectRemark: string, approved_or_reject: number) {

    this.showDialog("कृपया प्रतीक्षा करें.....");

    // this.apiService.approveRejectComplain(
    //   this.loginedOffierEmpId,
    //   approved_or_reject,
    //   approvedRejectRemark,
    //   this.comingComplaintData.complain_history_table_id,
    //   this.comingComplaintData.complain_id,
    // ).subscribe(
    //   async (response) => {

    //     await this.dismissDialog();
    //     this.cdRef.detectChanges;

    //     if (response.response.code === 200) {

    //       this.sharedService.setRefresh(true);

    //       this.goBack();

    //     } else {
    //       this.longToast(response.response.msg)
    //     }

    //   },
    //   async (error) => {
    //     //await this.dismissLoading();
    //     this.shortToast(error);
    //     //this.apiService.showServerMessages(error)
    //   }
    // );
  }

  async shortToast(msg: string) {
    console.log(msg);
    await Toast.show({
      text: msg,
      duration: 'short', // 'short' (2s) or 'long' (3.5s)
      position: 'bottom', // 'top', 'center', or 'bottom'
    });
  }

  async longToast(msg: string) {
    await Toast.show({
      text: msg,
      duration: 'long', // 'short' (2s) or 'long' (3.5s)
      position: 'bottom', // 'top', 'center', or 'bottom'
    });
  }

  showDialog(msg: string) {
    this.loadingMessage = msg;
    this.isLoading = true;
    this.cdRef.detectChanges();
  }

  dismissDialog() {
    this.isLoading = false;
    this.cdRef.detectChanges();
  }

  loginedOffierEmpId: number = 0;

  async getLoginedOfficerDetail() {
    const value  = await localStorage.getItem('user');

    if (value) {
      const userData = JSON.parse(value) as UserLoginResponse;
      this.loginedOffierEmpId = userData.emp_id;
    }
  }

  async showImageAlert(imageUrl: string) {
    // const alert = await this.alertCtrl.create({
    //   header: 'Image',
    //   message: `<img src="${imageUrl}" style="width:100%">`,
    //   buttons: ['Close'],
    // });
    // await alert.present();


    const modal = await this.modalCtrl.create({
      component: ImagePreviewModalComponent,
      cssClass: 'custom-dialog-modal',
      componentProps: {
        imageUrl: imageUrl
      },
      backdropDismiss: true,
    });

    await modal.present();

  }

}
