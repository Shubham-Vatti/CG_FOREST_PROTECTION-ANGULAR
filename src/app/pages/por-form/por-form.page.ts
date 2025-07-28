import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular/standalone';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { NgSelectModule } from '@ng-select/ng-select';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import {
  arrowBack,
  body,
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { Platform } from '@ionic/angular';
import { SharedserviceService } from 'src/app/services/sharedService/sharedservice.service';
import { ApiService } from 'src/app/services/api.service';
import { SelectDateDialogComponent } from 'src/app/dialogs/select-date-dialog/select-date-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { userdataprops } from 'src/app/profile-data/profile_data.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoaderService } from 'src/app/services/loader.service';
import { SQLiteService } from 'src/app/services/localstorage/sqlite.service';
import {
  EmployeeData,
  MasterDataProps,
} from 'src/assets/models/reusable.model';
// import { Platform } from '@angular/cdk/platform.d-cnFZCLss';

@Component({
  selector: 'app-por-form',
  templateUrl: './por-form.page.html',
  styleUrls: ['./por-form.page.scss'],
  standalone: true,
  providers: [Diagnostic, provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    IonicModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
})
export class PorFormPage implements OnInit {
  photos: string[] = [];

  agreeForm!: FormGroup; // 👈 declare formGroup
  isLoading: boolean = false;
  loadingMessage: string = '';

  current_location_google_addres: string =
    'Getting your location, please wait....';

  lat: number = 0.0;
  lon: number = 0.0;

  latitude: number | null = null;
  longitude: number | null = null;

  accussedName: string = '';
  PorNo: string = '';
  accussedFatherName: string = '';
  address: string = '';

  selectedAccusedCast: any = null;
  selectedCrimType: any = null;
  crimePlace: string = '';
  crimeDate: string = '';
  witness: string = '';

  FirstwitnessName: string = '';
  SecondwitnessName: string = '';
  FirstwitnessAddress: string = '';
  SecondwitnessAddress: string = '';

  seizedGoodDetail: string = '';
  placeofCrime: string = '';

  selectedCrime: any = null;
  selectedDhara: string = '';
  filteredDharaList: string[] = [];
  storeduserData!: EmployeeData;

  listOfCrimType: any = [];
  listOfCast: any = [];
  listOfBeat: any = [];
  selectedCaste: string = '';
  selectedCompartment: string = '';
  loginedOfficerEmpId: number = 0;
  constructor(
    private sharedService: SharedserviceService,
    private cdRef: ChangeDetectorRef,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private navController: NavController,
    private apiService: ApiService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private translate: TranslateService,
    private loader: LoaderService, // <-- inject loader service
    private sqliteService: SQLiteService
  ) {
    this.agreeForm = this.fb.group({
      agree: new FormControl(null),
    });
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
    this.getLoginedOfficerData();

    this.getCurrentLatLng();

    this.setCrimDate();

    this.agreeForm = this.fb.group({
      agree: new FormControl(null),
    });
  }

  setCrimDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    this.crimeDate = `${yyyy}-${mm}-${dd}`;
  }

  async getCurrentLatLng() {
    try {
      this.current_location_google_addres = this.translate.instant(
        'PorFormScreen.locationtxt'
      );

      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000, // ⬅️ Increase timeout (20 seconds)
        maximumAge: 0,
      });
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.isGettingLocation = false;
      this.getGoogleAddress(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      );

      this.cdRef.detectChanges();
    } catch (err) {
      console.error('Location error', err);
    }
  }

  getGoogleAddress(lat: number, lon: number) {
    this.apiService.getGoogleAddress(lat, lon).subscribe(
      (response) => {
        if (response != null) {
          this.current_location_google_addres =
            response.display_name.toString();
          console.log('Login Success:', response.display_name);
          this.cdRef.detectChanges();
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
        this.getCurrentLatLng();
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
    const formData = new FormData();

    // Text fields
    formData.append('accusedName', this.accussedName);
    formData.append('accusedFathersName', this.accussedFatherName);
    formData.append('accusedCast', '1');
    formData.append('accusedAddress', this.address.toString());
    formData.append('typeOfCrime', this.selectedCrime);
    formData.append('placeOfCrime', this.placeofCrime.toString());
    formData.append('dateOfCrime', this.crimeDate);
    formData.append('detailsOfSeizedGoods', this.seizedGoodDetail.toString());
    formData.append(
      'address_of_witness_one',
      this.FirstwitnessAddress.toString()
    );
    formData.append('name_of_witness_one', this.FirstwitnessName.toString());
    formData.append(
      'address_of_witness_two',
      this.SecondwitnessAddress.toString()
    );
    formData.append('name_of_witness_two', this.SecondwitnessName.toString());
    formData.append('por_number', this.PorNo.toString());
    formData.append('createdBy', this.storeduserData.emp_id.toString());
    formData.append('crime_dhara', this.selectedDhara);
    formData.append('lat', this.latitude?.toString() || '');
    formData.append('lng', this.longitude?.toString() || '');
    formData.append('range_id', this.storeduserData.range_id.toString());
    formData.append(
      'sub_division_id',
      this.storeduserData.sub_division_id.toString()
    );
    formData.append('sub_rang_id', this.storeduserData.range_id.toString());
    formData.append('division_id', this.storeduserData.division_id.toString());
    formData.append('circle_id', this.storeduserData.circle_id.toString());
    formData.append('beat_id', this.storeduserData.beat_id.toString());
    formData.append('compartment_number', this.selectedCompartment);
    formData.append('map_address', this.current_location_google_addres);

    console.log('accusedName:', this.accussedName);
    console.log('accusedFathersName:', this.accussedFatherName);
    console.log('accusedCast:', this.selectedCaste);
    console.log('accusedAddress:', this.address);
    console.log('typeOfCrime:', this.selectedCrimType);
    console.log('placeOfCrime:', this.crimePlace);
    console.log('dateOfCrime:', this.crimeDate);
    console.log('detailsOfSeizedGoods:', this.seizedGoodDetail);
    console.log('address_of_witness_one:', this.FirstwitnessAddress);
    console.log('name_of_witness_one:', this.FirstwitnessName);
    console.log('address_of_witness_two:', this.SecondwitnessAddress);
    console.log('name_of_witness_two:', this.SecondwitnessName);
    console.log('por_number:', this.PorNo);
    console.log('crime_dhara:', this.selectedDhara);
    console.log('lat:', '123.32323');
    console.log('lng:', '1231232.3232');
    console.log('range_id:', this.storeduserData.range_id);
    console.log('sub_division_id:', this.storeduserData.sub_division_id);
    console.log('sub_rang_id:', this.storeduserData.range_id);
    console.log('division_id:', this.storeduserData.division_id);
    console.log('circle_id:', this.storeduserData.circle_id);
    console.log('beat_id:', this.storeduserData.beat_id);
    console.log('compartment_number:', this.selectedCompartment);

    // Image files from photos[] array
    for (let i = 0; i < this.photos.length; i++) {
      const blob = this.dataURLtoBlob(this.photos[i]);
      formData.append('listOfFile', blob, `photo_${i + 1}.jpg`);
    }

    console.log('--formdata--', formData);
    this.loader.show('शिकायत जमा किया जा रहा है कृपया इंतजार करें');
    this.apiService.submitCrimData(formData).subscribe(
      (response) => {
        this.dismissDialog();
        if (response.response.code === 200) {
          this.loader.hide();
          alert(response.response.msg);
          // this.afterSubmitComplainSuccessfully(response.response.msg, true);
          this.sharedService.setRefresh(true);
        } else {
          this.loader.hide();

          this.longToast(response.response.msg);
        }

        console.log('submitComplainInfo', response.response);
      },
      (error) => {
        this.loader.hide();
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

  async getLoginedOfficerData() {
    const value: MasterDataProps = await this.sqliteService.getOfflineData();
    this.listOfCast = value.cast;
    this.listOfCrimType = value.crimType;
    this.listOfBeat = value.beat[0].compartment_no[0]
      .split(',')
      .map((comp) => comp.trim());

    this.storeduserData = value.data[0];
    this.loginedOfficerEmpId = value.data[0].emp_id;
  }

  cancel() {
    this.goBack();
  }

  onCrimeChange(selectedCrimeId: number) {
    const selected = this.listOfCrimType.find(
      (item: any) => item.id === selectedCrimeId
    );
    this.selectedCrime = selected.id;
    console.log('--selected-crime-type--', selected.id);
    this.filteredDharaList = selected ? selected.dhara : [];
    this.selectedDhara = ''; // Reset dhara when crime changes
  }

  // getMasterData(data: number) {
  //   this.loader.show('कृपया प्रतीक्षा करें.....');
  //   this.apiService
  //     .getCastAndCrimMaster(JSON.stringify({ emp_id: data }))
  //     .subscribe({
  //       next: async (response) => {
  //         this.loader.hide();
  //         console.log('-Data--inside--caste-', response.cast_data);
  //         console.log('listOfBeat', response.beat_name);
  //         if (response.response.code === 200) {
  //           this.listOfCast = response.cast_data;
  //           this.listOfCrimType = response.crim_type_data;
  //           this.listOfBeat = response.beat_name[0].compartment_no[0]
  //             .split(',')
  //             .map((comp) => comp.trim());
  //         }
  //       },
  //       error: async (error) => {
  //         this.loader.hide();
  //         this.cdRef.detectChanges();
  //         this.shortToast(error);
  //       },
  //     });
  // }

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
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    // const watermarked = await this.addWatermarkToImage(image.dataUrl!);

    if (image.dataUrl) {
      this.photos.push(image.dataUrl); // ✅ Safe now
    } else {
      console.warn('No image data found');
    }
  }

  private async addWatermarkToImage(base64Image: string): Promise<string> {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = base64Image;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Watermark text
        const now = new Date();
        const watermarkText = now.toLocaleString();

        ctx!.font = 'bold 40px Arial';
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx!.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx!.lineWidth = 3;

        const x = 20;
        const y = canvas.height - 30;

        // Stroke for contrast
        ctx!.strokeText(watermarkText, x, y);
        ctx!.fillText(watermarkText, x, y);

        // Export new image
        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(watermarkedDataUrl);
      };

      image.onerror = (err) => {
        console.error('Image load error', err);
      };
    });
  }
}
