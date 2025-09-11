import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { addIcons } from 'ionicons';
import {
  arrowBack,
  calendar,
  calendarOutline,
  camera,
  cameraOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  close,
  closeCircle,
  closeCircleOutline,
  documentTextOutline,
  imageOutline,
  locationOutline,
  mic,
  micCircleOutline,
  micOutline,
} from 'ionicons/icons';

import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { NavController, ModalController } from '@ionic/angular/standalone';
import { Toast } from '@capacitor/toast';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { SelectDateDialogComponent } from 'src/app/dialogs/select-date-dialog/select-date-dialog.component';

import { SharedserviceService } from 'src/app/services/sharedService/sharedservice.service';

import { ApiService } from 'src/app/services/api.service';

import { Router } from '@angular/router';
import { MasterDataProps } from 'src/assets/models/reusable.model';
import {
  EmployeeData,
  SQLiteService,
} from '../services/localstorage/sqlite.service';
import { PORFormDataprops } from '../pages/por-form-list/por-form-list.model';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-ra-work-log',
  templateUrl: './ra-work-log.component.html',
  styleUrls: ['./ra-work-log.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  providers: [SpeechRecognition],
})
export class RaWorkLogComponent implements OnInit {
  workLogText: string = '';
  address: string = '';
  isListening = false;

  isLoading: boolean = false;
  loadingMessage: string = '';

  spoken: string[] = [];
  photos: string[] = [];

  comingComplaintData!: PORFormDataprops;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private platform: Platform,
    private sharedService: SharedserviceService,
    private modalController: ModalController,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef,
    private navController: NavController,
    private speechRecognition: SpeechRecognition,
    private sqliteService: SQLiteService,
    private loader: LoaderService
  ) {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      arrowBack,
      cameraOutline,
      closeCircle,
      micCircleOutline,
      mic,
      micOutline,
      documentTextOutline,
      locationOutline,
      chevronForwardOutline,
      calendar,
      calendarOutline,
      close,
      imageOutline,
      camera,
    });
  }

  async ngOnInit() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    this.workLogDate = `${yyyy}-${mm}-${dd}`;

    this.getLoginedOfficerData();

    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state?.['data'];

    console.log('Navigation data:', data, '--', nav);

    if (data) {
      // Convert plain object back to model
      this.comingComplaintData = data as PORFormDataprops;
      this.toolbarTitle = data.por_number;
    }
  }

  toolbarTitle: string = '';

  async startListeningNew() {
    if (!(await this.checkAndRequestPermissionForMic())) {
      this.showPermissionAlert(
        'माइक्रोफ़ोन अनुमति आवश्यक है। कृपया सेटिंग्स से अनुमति दें।'
      );
      return;
    }

    if (!this.isListening) {
      this.isListening = true;
      console.log('StartListening1');
      this.listenLoop();
    } else {
      console.log('StopListening111');
      this.stopListening();
    }
  }

  private listenLoop() {
    if (!this.isListening) return;
    console.log('StartListening1212');
    this.speechRecognition
      .startListening({
        language: 'hi-IN',
        showPopup: false,
        matches: 1,
      })
      .subscribe(
        (matches) => {
          console.log('StartListening666');
          const spoken = matches[0];
          this.ngZone.run(() => {
            this.workLogText += (this.workLogText ? ' ' : '') + spoken;
          });
          if (this.isListening) setTimeout(() => this.listenLoop(), 300);
          console.log('StartListening66690');
        },
        (error) => {
          console.log('Error', error);
          console.error('Speech error:', error);
          if (this.isListening) setTimeout(() => this.listenLoop(), 800);
        },
        () => {
          console.log('StartListening6663478374');
          if (this.isListening) setTimeout(() => this.listenLoop(), 800);
        }
      );
  }

  stopListening() {
    this.isListening = false;
    this.speechRecognition.stopListening();
  }

  goBack() {
    this.navController.back();
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  async takePic() {
    if (this.photos.length >= 1) {
      this.longToast('आप 1 फोटो ही ले सकते हैं');
      return;
    }

    const permission = await Camera.checkPermissions();
    if (permission.camera !== 'granted') {
      const result = await Camera.requestPermissions();
      if (result.camera !== 'granted') {
        this.showPermissionAlert('Camera permission not granted');
        return;
      }
    }

    const image = await Camera.getPhoto({
      quality: 10,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (image.dataUrl) {
      this.photos.push(image.dataUrl); // ✅ Safe now
    } else {
      console.warn('No image data found');
    }
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

  async showPermissionAlert(msg: string) {
    const modal = await this.modalController.create({
      component: MessageDialogComponent,
      cssClass: 'custom-dialog-modal',
      componentProps: {
        server_message: msg,
        isYesNo: false,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data?.confirmed) {
      }
    });

    await modal.present();
  }

  workLogDate: string = '';

  async onSelectDate() {
    const modal = await this.modalController.create({
      component: SelectDateDialogComponent,
      cssClass: 'custom-dialog-modal',
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.confirmed) {
        const date = new Date(this.sharedService.getSelectedCrimeDate());
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        this.workLogDate = `${yyyy}-${mm}-${dd}`;
        console.log('formated_date', this.workLogDate);
      }
    });

    await modal.present();
  }

  // async ionViewDidEnter() {
  //   await this.platform.ready();
  //   this.checkAndRequestPermissionForMic();
  // }

  async checkAndRequestPermissionForMic(): Promise<boolean> {
    const hasPermission = await this.speechRecognition.hasPermission();
    console.log('Has mic permission:', hasPermission);

    if (!hasPermission) {
      try {
        await this.speechRecognition.requestPermission();
        console.log('Permission granted.');
        return true; // ✅ return true AFTER success
      } catch (err) {
        console.log('Permission denied:', err);
        return false;
      }
    }

    return true; // Already has permission
  }

  cancel() {
    this.navController.back();
  }

  async submitWorkLog(isFinalSubmit: string) {
    if (this.workLogText === '') {
      alert('कृपया अपने कार्य का लॉग लिखें');
      return;
    }

    if (this.address === '') {
      alert('पता  (मुकाम) डालें');
      return;
    }

    const formData = new FormData();
    formData.append('emp_id', this.loginedOfficerEmpId.toString());
    formData.append('work_log_text', this.workLogText.toString());
    formData.append('address', this.address);
    formData.append('complain_id', this.comingComplaintData.complain_id);
    formData.append('is_final_submit', isFinalSubmit);
    formData.append(
      'complain_history_table_id',
      this.comingComplaintData.complain_history_table_id
    );
    formData.append('japti_saman_data', 'sample');

    const formDataObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key !== 'listOfFile') {
        formDataObj[key] = value;
      } else {
        formDataObj[key] = '(file content)';
      }
    });
    console.log('FormData as object-submit complain:', formDataObj);
    for (let i = 0; i < this.photos.length; i++) {
      const blob = this.dataURLtoBlob(this.photos[i]);
      formData.append('listOfFile', blob, `photo_${i + 1}.jpg`);
    }

    this.loader.show('जमा किया जा रहा है कृपया इंतजार करें');
    (await this.apiService.submitWorkLog(formData)).subscribe(
      (response) => {
        this.loader.hide();
        if (response.response.code === 200) {
          alert(response.response.msg);
          this.sharedService.setRefresh(true);
        } else {
          this.longToast(response.response.msg);
        }

        console.log('submitWorkLogInfo', response.response);
      },
      (error) => {
        console.log('Error', error);
        this.loader.hide();
        this.longToast(error);
      }
    );
  }

  async afterSubmitLog(msg: string, isGoBack: boolean) {
    const modal = await this.modalController.create({
      component: MessageDialogComponent,
      cssClass: 'custom-dialog-modal',
      componentProps: {
        server_message: msg,
        isYesNo: false,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.confirmed) {
        console.log('Dialog confirmed!');
        if (isGoBack) {
          this.goBack();
        }
      }
    });

    await modal.present();
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

  dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  async showError(errorMsg: string) {
    try {
      const modal = await this.modalController.create({
        component: MessageDialogComponent,
        componentProps: {
          server_message: errorMsg,
          isYesNo: false,
        },
        cssClass: 'custom-dialog-modal',
        backdropDismiss: false,
      });

      await modal.present();
    } catch (err) {
      console.error('Modal creation failed', err);
    }
  }

  loginedOfficerEmpId: number = 0;
  loginedOfficerCircleId: string = '0';
  loginedOfficerDivisionId: string = '0';
  loginedOfficerSubDivisionId: string = '0';
  loginedOfficerRangId: string = '0';
  loginedOfficerBeatId: string = '0';

  async getLoginedOfficerData() {
    const data: MasterDataProps = await this.sqliteService.getOfflineData();

    if (data) {
      this.loginedOfficerEmpId = data.data[0].emp_id;
      this.loginedOfficerCircleId = data.data[0].circle_id;
      this.loginedOfficerDivisionId = data.data[0].division_id;
      this.loginedOfficerSubDivisionId = data.data[0].sub_division_id;
      this.loginedOfficerRangId = data.data[0].range_id;
      this.loginedOfficerBeatId = data.data[0].beat_id;
    }
  }

  generatePDF() {}

  async selectWorkLogDate() {
    const modal = await this.modalController.create({
      component: SelectDateDialogComponent,
      cssClass: 'custom-dialog-modal',
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.confirmed) {
        const date = new Date(this.sharedService.getSelectedCrimeDate());
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        this.workLogDate = `${yyyy}-${mm}-${dd}`;
        console.log('formated_date', this.workLogDate);
      }
    });

    await modal.present();
  }
}
