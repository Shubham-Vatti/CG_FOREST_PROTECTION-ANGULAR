import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { NavController, ModalController } from '@ionic/angular/standalone';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { NgSelectModule } from '@ng-select/ng-select';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {IonicModule} from '@ionic/angular'
import {
  arrowBack,
  calendarOutline,
  cameraOutline,
  checkmarkCircleOutline,
  closeCircle,
  closeCircleOutline,
  locationOutline,
  refreshCircleOutline,
} from 'ionicons/icons';
import { Toast } from '@capacitor/toast';
import { Geolocation } from '@capacitor/geolocation';
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
  IonCol,
  IonRow,
  IonGrid,
  IonText,
  IonCard,
  IonCardContent,
  IonLoading,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { addIcons } from 'ionicons';
import { Platform } from '@ionic/angular';
import { SharedserviceService } from 'src/app/services/sharedService/sharedservice.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { SelectDateDialogComponent } from 'src/app/dialogs/select-date-dialog/select-date-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { userdataprops } from 'src/app/profile-data/profile_data.model';
// import { Platform } from '@angular/cdk/platform.d-cnFZCLss';

@Component({
  selector: 'app-por-form',
  templateUrl: './por-form.page.html',
  styleUrls: ['./por-form.page.scss'],
  standalone: true,
  providers: [Diagnostic],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    IonicModule
    
  ],
})
export class PorFormPage implements OnInit {
  photos: string[] = [];

  isLoading: boolean = false;
  loadingMessage: string = '';

  current_location_google_addres: string =
    'Getting your location, please wait....';

  lat: number = 0.0;
  lon: number = 0.0;

  latitude: number | null = null;
  longitude: number | null = null;

  accussedName: string = '';
  accussedFatherName: string = '';
  address: string = '';
  selectedAccusedCast: any = null;

  selectedCrimType: any = null;
  crimePlace: string = '';
  crimeDate: string = '';
  witness: string = '';
  seizedGoodDetail: string = '';

  listOfCrimType: any = [];
  listOfCast: any = [];

  constructor(
    private sharedService: SharedserviceService,
    private cdRef: ChangeDetectorRef,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private navController: NavController,
    private apiService: ApiService,
    private modalController: ModalController,
  ) {
    addIcons({
      closeCircle,
      cameraOutline,
      arrowBack,
      locationOutline,
      refreshCircleOutline,
      calendarOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
    });
  }

  async ngOnInit() {
    this.getCurrentLatLng();

    this.setCrimDate();

    this.getMasterData();

    this.getLoginedOfficerData();
    
    // this.getCurrentLatLng()
  }

  setCrimDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    this.crimeDate = `${yyyy}-${mm}-${dd}`;
  }

  // getTranslation(key: string) {
  //   return this.languageService.getTranslation(key);
  // }


  async getCurrentLatLng() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 20000, // ⬅️ Increase timeout (20 seconds)
      maximumAge: 0
    });
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.isGettingLocation = false;
      this.getGoogleAddress(coordinates.coords.latitude, coordinates.coords.longitude);
    } catch (err) {
      console.error('Location error', err);
    }
  }


  // async getCurrentLocation() {
  //   try {
  //     const position = await Geolocation.getCurrentPosition({
  //       enableHighAccuracy: true,
  //       timeout: 20000, // 20 seconds
  //       maximumAge: 0,
  //     });
  //     this.lat = position.coords.latitude;
  //     this.lon = position.coords.longitude;
  //     // console.log('Lat~Lng', this.lat + '~' + this.lon);
  //     this.getGoogleAddress(this.lat, this.lon);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  getGoogleAddress(lat: number, lon: number) {
    this.apiService.getGoogleAddress(lat, lon).subscribe(
      (response) => {
        if (response != null) {
          this.current_location_google_addres =
            response.display_name.toString();
          console.log('Login Success:', response.display_name);
        } else {
          //this.longToast('Problem to initialize application');
        }
      },
      (error) => {
        console.error('Failed to get address', error);
      }
    );
  }

  isGettingLocation = false;

  async checkLocationPermissionAndNavigate() {
    await this.platform.ready();
    this.isGettingLocation = true;
    try {
      // Step 1: Check if GPS is enabled
      const isGpsEnabled = await this.diagnostic.isLocationEnabled();
      if (!isGpsEnabled) {
        console.log('GPS is off, prompting user to enable it...');
        await this.diagnostic.switchToLocationSettings();
        return;
      }
      // Step 2: Request location permissions
      const permStatus = await Geolocation.requestPermissions();

      if (permStatus.location === 'granted') {
        console.log('Location permission granted.');

        // Step 3: Get current position
        // const coordinates = await Geolocation.getCurrentPosition();
        // console.log('Location:', coordinates)
        this.getCurrentLatLng()
        // this.getCurrentLocation();
      } else {
        this.showPermissionAlert('Location permission not granted');
      }
    } catch (error) {
      this.isGettingLocation = false;
      console.error('Error during location access:', error);
    }
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

  goBack() {
    this.navController.back();
  }

  async onSelecteCrimDate() {
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
        this.crimeDate = `${yyyy}-${mm}-${dd}`;
        console.log('formated_date', this.crimeDate);
      }
    });

    await modal.present();
  }

  submitCrimDetail() {
    if (this.accussedName === '') {
      this.shortToast('अपराधी का नाम');
      return;
    }

    if (this.accussedFatherName === '') {
      this.shortToast('अपराधी के पिता का नाम');
      return;
    }

    if (this.address === '') {
      this.shortToast('अपराधी का पता');
      return;
    }

    if (this.selectedAccusedCast === null) {
      this.shortToast('जाति वर्ग चुने');
      return;
    }

    if (this.selectedCrimType === null) {
      this.shortToast('अपराध का प्रकार चुनें');
      return;
    }

    if (this.witness === '') {
      this.shortToast('अपराध साक्षी का नाम');
      return;
    }

    if (this.crimePlace === '') {
      this.shortToast('अपराध की जगह');
      return;
    }

    if (this.seizedGoodDetail === '') {
      this.shortToast('जब्त सामान का विवरण');
    }

    const formData = new FormData();

    // Text fields
    formData.append('accusedName', this.accussedName);
    formData.append('accusedFathersName', this.accussedFatherName);
    formData.append('accusedCast', this.selectedAccusedCast.toString());
    formData.append('accusedAddress', this.address.toString());
    formData.append('typeOfCrime', this.selectedCrimType.toString());
    formData.append('placeOfCrime', this.crimePlace.toString());
    formData.append('dateOfCrime', this.crimeDate);
    formData.append('detailsOfSeizedGoods', this.seizedGoodDetail.toString());
    formData.append('nameOfWitness', this.witness.toString());
    formData.append('createdBy', this.loginedOfficerEmpId.toString());

    // Image files from photos[] array
    for (let i = 0; i < this.photos.length; i++) {
      const blob = this.dataURLtoBlob(this.photos[i]);
      formData.append('listOfFile', blob, `photo_${i + 1}.jpg`);
    }

    this.showDialog('शिकायत जमा किया जा रहा है कृपया इंतजार करें');
    this.apiService.submitCrimData(formData).subscribe(
      (response) => {
        this.dismissDialog();
        if (response.response.code === 200) {
          this.afterSubmitComplainSuccessfully(response.response.msg, true);
          this.sharedService.setRefresh(true);
        } else {
          this.longToast(response.response.msg);
        }

        console.log('submitComplainInfo', response.response);
      },
      (error) => {
        console.log('Error', error);
        this.dismissDialog();
        this.longToast(error);
      }
    );
  }

  async afterSubmitComplainSuccessfully(msg: string, isGoBack: boolean) {
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

  loginedOfficerEmpId: number = 0;

  async getLoginedOfficerData() {
    const value = await localStorage.getItem('user');

    if (value) {
      const userData = JSON.parse(value) as userdataprops;
      this.loginedOfficerEmpId = userData.emp_id;
    }
  }

  cancel() {
    this.goBack();
  }

  getMasterData() {
    this.showDialog('कृपया प्रतीक्षा करें.....');
    this.apiService.getCastAndCrimMaster().subscribe({
      next: async (response) => {
        this.dismissDialog();
        console.log('Data--inside--caste', response.response.code);
        if (response.response.code === 200) {
          this.listOfCast = response.cast_data;
          this.listOfCrimType = response.crim_type_data;
        }
      },
      error: async (error) => {
        this.cdRef.detectChanges();
        this.dismissDialog();
        this.shortToast(error);
      },
    });
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

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  async takePic() {
    if (this.photos.length >= 5) {
      this.longToast('आप अधिकतम 5 फोटो ले सकते हैं');
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
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (image.dataUrl) {
      this.photos.push(image.dataUrl); // ✅ Safe now
    } else {
      console.warn('No image data found');
    }
  }
}
