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
  addCircleOutline,
  arrowBack,
  body,
  calendarOutline,
  cameraOutline,
  checkmarkCircleOutline,
  closeCircle,
  closeCircleOutline,
  locationOutline,
  refreshCircleOutline,
  remove,
  trashOutline,
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
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
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
import { NetworkService } from 'src/app/services/internetnetwork/network.service';
import { Network } from '@capacitor/network';
import { PORFormDataprops } from '../por-form-list/por-form-list.model';
import { Router } from '@angular/router';

interface Caste {
  id: number | string;
  name: string;
}

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
    MatCheckbox,
  ],
})
export class PorFormPage implements OnInit {
  offlineData: any = null;

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

  isOffline: boolean = false;

  seizedGoodDetail: string = '';
  placeofCrime: string = '';

  selectedCrime: any = null;
  selectedDhara: string = '';
  storeduserData!: EmployeeData;

  listOfCrimType: any = [];
  listOfCast: any = [];
  listOfBeat: any = [];
  selectedCaste: Caste | string | null = null; // or whatever initial value
  selectedCompartment: string = '';
  loginedOfficerEmpId: number = 0;
  accussed_found: number = -1;

  selectedDharaType!: any;
  listofDharaType: any = [];
  filteredDharaList: string[] = [];

  ListofPrajati: any[] = [];
  selectedPrajati: any;

  dynamicInputs: { prajati: any; golai: string; nug: string }[] = [];
  anyajaptisamanvivran: any;
  anyajaptisamanvivranflag: boolean = false;

  ChangeJaptisamanvivran() {
    this.anyajaptisamanvivranflag = !this.anyajaptisamanvivranflag;
  }

  dynamicKashtInputs: {
    prajati: any;
    golai: string;
    lambai: string;
    nug: string;
  }[] = [];

  removeInput(index: number) {
    this.dynamicInputs.splice(index, 1);
  }

  removeKashtInput(index: number) {
    this.dynamicKashtInputs.splice(index, 1);
  }

  addInput() {
    this.dynamicInputs.push({
      prajati: null,
      golai: '',
      nug: '',
    });
  }

  addKashtInput() {
    this.dynamicKashtInputs.push({
      prajati: null,
      golai: '',
      lambai: '',
      nug: '',
    });
  }
  selectedSeizedGoods: any[] = [];

  maxDate: Date = new Date();
  accused_found_onChange(data: number) {
    if (this.accussed_found !== data) {
      this.accussed_found = data;
    } else {
      this.accussed_found = -1;
    }
  }

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
    private sqliteService: SQLiteService,
    private networkservice: NetworkService,
    private router: Router
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
      addCircleOutline,
      trashOutline,
    });
  }
  async ngOnInit() {
    this.checkNetworkStatus();
    this.getLoginedOfficerData();
    this.getCurrentLatLng();
    this.setCrimDate();

    this.agreeForm = this.fb.group({
      agree: new FormControl(null),
    });

    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state?.['data'];
    console.log('--view-POR_OFFLINE_DATA--', data);
    if (data) {
      console.log('--populating-data--');
      console.log(JSON.parse(data));
      this.populateFormWithOfflineData(JSON.parse(data));
    }
  }

  // Add this method to populate form with offline data
  populateFormWithOfflineData(data?: PORFormDataprops) {
    if (!data) return;

    // Populate form fields with offline data
    this.accussed_found = data?.is_accused_found ?? -1;
    this.accussedName = data.accused_name || '';
    this.accussedFatherName = data.accused_fathers_name || '';
    this.address = data.accused_address || '';
    this.PorNo = data.por_number || '';
    this.selectedCompartment = data.compartment_number || '';

    // Set caste if available
    if (data.cast_name) {
      const caste = this.listOfCast.find((c: any) => c.id === data.cast_name);
      this.selectedCaste = caste || null;
    }

    // Set crime type if available
    if (data.type_of_crime) {
      const crime = this.listOfCrimType.find(
        (c: any) => c.id === data.type_of_crime
      );
      this.selectedCrime = crime ? crime.id : null;
    }

    this.placeofCrime = data.place_of_crime || '';
    this.seizedGoodDetail = data.details_of_seized_goods || '';
    this.FirstwitnessName = data.name_of_witness_one || '';
    this.FirstwitnessAddress = data.address_of_witness_one || '';
    this.SecondwitnessName = data.name_of_witness_two || '';
    this.SecondwitnessAddress = data.address_of_witness_two || '';
    this.selectedDhara = data.crime_dhara || '';
    this.crimeDate = data.date_of_crime || this.crimeDate;

    // Handle Saman_Detail if available
    if (data.japtSamanList.length > 0) {
      try {
        this.processSamanDetails(data.japtSamanList);
      } catch (e) {
        console.error('Error parsing Saman_Detail', e);
      }
    }

    this.cdRef.detectChanges();
  }

  // Add method to process Saman details
  processSamanDetails(samanDetails: any[]) {
    this.dynamicInputs = [];
    this.dynamicKashtInputs = [];
    this.anyajaptisamanvivran = '';

    samanDetails.forEach((detail: any) => {
      if (detail.jabti_saman_type === '1') {
        // Type 1: Regular inputs
        this.dynamicInputs.push({
          prajati: detail.prajati_type || null,
          golai: detail.golai || '',
          nug: detail.nag || '',
        });
      } else if (detail.jabti_saman_type === '2') {
        // Type 2: Kasht inputs
        this.dynamicKashtInputs.push({
          prajati: detail.prajati_type || null,
          golai: detail.golai || '',
          lambai: detail.lambai || '',
          nug: detail.nag || '',
        });
      } else if (detail.jabti_saman_type === '3') {
        // Type 3: Other details
        this.anyajaptisamanvivran = detail.if_other_then_detail || '';
        this.anyajaptisamanvivranflag = !!this.anyajaptisamanvivran;
      }
    });
  }

  setCrimDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    this.crimeDate = `${yyyy}-${mm}-${dd}`;
  }

  private networkListener: any;

  ngOnDestroy() {
    if (this.networkListener) {
      this.networkListener.remove();
    }
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

  async setupNetworkListener() {
    // Listen for network status changes
    this.networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        console.log('Network status changed', status);
        this.isOffline = !status.connected;
        this.cdRef.detectChanges(); // Ensure UI updates
      }
    );
  }

  async checkNetworkStatus() {
    try {
      const status = await Network.getStatus();
      this.isOffline = !status.connected;
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error getting network status', error);
      // Assume offline if we can't determine status
      this.isOffline = true;
      this.cdRef.detectChanges();
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
        this.diagnostic.switchToLocationSettings();
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

  async submitCrimDetail() {
    const result = [];

    console.log('--data-inpttttt--', this.selectedCompartment);

    // Process dynamicKashtInputs (type 1) - only if array exists and has items
    if (
      Array.isArray(this.dynamicKashtInputs) &&
      this.dynamicKashtInputs.length > 0
    ) {
      this.dynamicKashtInputs.forEach((item) => {
        if (item) {
          // Check if item exists
          result.push({
            jabti_saman_type: '2',
            prajati_type:
              item.prajati?.id?.toString() || item.prajati?.toString() || '',
            lambai: item.lambai?.toString() || '',
            golai: item.golai?.toString() || '',
            ghan_meter: (Number(item.lambai) || 0) * (Number(item.golai) || 0),
            nag: item.nug?.toString() || '',
            dar: '',
            total_cost: '',
            if_other_then_detail: '',
          });
        }
      });
    }

    // Process dynamicInputs (type 2) - only if array exists and has items
    if (Array.isArray(this.dynamicInputs) && this.dynamicInputs.length > 0) {
      this.dynamicInputs.forEach((item) => {
        if (item) {
          // Check if item exists
          result.push({
            jabti_saman_type: '1',
            prajati_type:
              item.prajati?.id?.toString() || item.prajati?.toString() || '',
            lambai: '',
            golai: item.golai?.toString() || '',
            ghan_meter: '',
            nag: item.nug?.toString() || '',
            dar: '',
            total_cost: '',
            if_other_then_detail: '',
          });
        }
      });
    }

    // Process anyajaptisamanvivran (type 3) - only if it has value
    if (
      this.anyajaptisamanvivran !== undefined &&
      this.anyajaptisamanvivran !== null &&
      this.anyajaptisamanvivran.toString().trim() !== ''
    ) {
      result.push({
        jabti_saman_type: '3',
        prajati_type: '',
        lambai: '',
        golai: '',
        ghan_meter: '',
        nag: '',
        dar: '',
        total_cost: '',
        if_other_then_detail: this.anyajaptisamanvivran.toString().trim(),
      });
    }

    const formData = new FormData();

    // Text fields
    formData.append('is_accused_found', this.accussed_found + '');
    formData.append(
      'accusedName',
      this.accussedName ? this.accussedName.trim() : ''
    );
    formData.append(
      'accusedFathersName',
      this.accussedFatherName ? this.accussedFatherName.trim() : ''
    );
    formData.append('accusedAddress', this.address ? this.address.trim() : '');
    formData.append('typeOfCrime', this.selectedCrime);
    formData.append('placeOfCrime', this.placeofCrime.trim());
    formData.append('detailsOfSeizedGoods', this.seizedGoodDetail.trim());
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
    formData.append('range_id', this.storeduserData.range_id);
    formData.append('createdBy', this.storeduserData.emp_id.toString());
    formData.append('crime_dhara', this.selectedDhara);
    formData.append('lat', this.latitude?.toString() || '');
    formData.append('lng', this.longitude?.toString() || '');
    formData.append(
      'sub_division_id',
      this.storeduserData.sub_division_id.toString()
    );
    if (this.selectedCaste) {
      const casteId =
        typeof this.selectedCaste === 'object'
          ? this.selectedCaste.id?.toString()
          : this.selectedCaste.toString();
      formData.append('accusedCast', casteId ? casteId : '');
    }
    formData.append('dateOfCrime', this.crimeDate);
    formData.append('sub_rang_id', this.storeduserData.sub_rang_id.toString());
    formData.append('division_id', this.storeduserData.division_id.toString());
    formData.append('circle_id', this.storeduserData.circle_id.toString());
    formData.append('beat_id', this.storeduserData.beat_id.toString());
    formData.append('compartment_number', this.selectedCompartment);
    formData.append('map_address', this.current_location_google_addres);
    formData.append(
      'Saman_Detail',
      result.length > 0 ? JSON.stringify(result) : '[]'
    );

    // Image files from photos[] array
    for (let i = 0; i < this.photos.length; i++) {
      const blob = this.dataURLtoBlob(this.photos[i]);
      formData.append('listOfFile', blob, `photo_${i + 1}.jpg`);
    }

    const formDataObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log('FormData:', formDataObj);

    if (this.accussed_found != -1) {
      if (
        (this.accussed_found == 1 &&
          this.accussedName &&
          this.accussedFatherName &&
          this.address &&
          this.selectedCaste) ||
        (this.accussed_found == 0 && this.PorNo && this.selectedCompartment)
      ) {
        if (this.FirstwitnessName && this.FirstwitnessAddress) {
          if (this.SecondwitnessName && this.SecondwitnessAddress) {
            if (
              this.selectedDhara &&
              this.selectedCrime &&
              this.placeofCrime &&
              this.seizedGoodDetail &&
              this.crimeDate
            ) {
              if (!this.photos || this.photos.length === 0) {
                this.longToast('Please add at least one photo');
                // return false;
              } else {
                this.loader.show('शिकायत जमा किया जा रहा है कृपया इंतजार करें');
                if (await this.networkservice.getCurrentStatus()) {
                  this.apiService.submitCrimData(formData).subscribe(
                    (response) => {
                      this.dismissDialog();
                      if (response.response.code === 200) {
                        this.loader.hide();
                        this.navController.back();
                        this.sharedService.setRefresh(true);
                        alert(response.response.msg);
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
                } else {
                  const Offlineformdata = {
                    is_accused_found: this.accussed_found,
                    accusedName: this.accussedName
                      ? this.accussedName.trim()
                      : '',
                    accusedFathersName: this.accussedFatherName
                      ? this.accussedFatherName.trim()
                      : '',
                    accusedAddress: this.address ? this.address.trim() : '',
                    typeOfCrime: this.selectedCrime,
                    placeOfCrime: this.placeofCrime.trim(),
                    detailsOfSeizedGoods: this.seizedGoodDetail.trim(),
                    address_of_witness_one: this.FirstwitnessAddress.toString(),
                    name_of_witness_one: this.FirstwitnessName.toString(),
                    address_of_witness_two:
                      this.SecondwitnessAddress.toString(),
                    name_of_witness_two: this.SecondwitnessName.toString(),
                    por_number: this.PorNo.toString(),
                    range_id: this.storeduserData.range_id,
                    createdBy: this.storeduserData.emp_id,
                    crime_dhara: this.selectedDhara,
                    lat: this.latitude
                      ? parseFloat(this.latitude.toString())
                      : null,
                    lng: this.longitude
                      ? parseFloat(this.longitude.toString())
                      : null,
                    sub_division_id: this.storeduserData.sub_division_id,
                    accusedCast: this.selectedCaste
                      ? typeof this.selectedCaste === 'object'
                        ? this.selectedCaste.id
                          ? parseInt(this.selectedCaste.id.toString())
                          : null
                        : parseInt(this.selectedCaste.toString())
                      : null,
                    dateOfCrime: this.crimeDate,
                    sub_rang_id: this.storeduserData.sub_rang_id,
                    division_id: this.storeduserData.division_id,
                    circle_id: this.storeduserData.circle_id,
                    beat_id: this.storeduserData.beat_id,
                    compartment_number: this.selectedCompartment,
                    map_address: this.current_location_google_addres,
                    Saman_Detail:
                      result.length > 0 ? JSON.stringify(result) : '[]',
                  };

                  console.log(
                    '--form-data-por-offline-data--',
                    Offlineformdata
                  );
                  this.sqliteService.storeCrimeReport(
                    Offlineformdata,
                    this.photos
                  );
                  // const offlinedata = this.sqliteService.getCrimeReportStats();
                  // console.log('offlinedata', offlinedata);
                  this.loader.hide();
                  alert(
                    'इंटरनेट कनेक्शन उपलब्ध नहीं है आपका कंप्लेन ऑफलाइन स्टोर किया गया है आप इंटरनेट आते ही उसे सर्वर में डालें'
                  );
                  this.navController.back();
                }
              }
            } else {
              this.longToast('अपराध सम्बन्धी जानकारी भरें');
            }
          } else {
            this.longToast(
              'द्वितीय साक्षी का नाम , द्वितीय साक्षी का पता भरें'
            );
          }
        } else {
          this.longToast('प्रथम साक्षी का नाम , प्रथम साक्षी का पता भरें');
        }
      } else {
        this.longToast(
          this.accussed_found == 1
            ? 'व्यक्तिगत जानकारी :- आरोपी का नाम , पता , जाति , पिता का नाम भरें'
            : 'पोर संख्या , कम्पार्टमेंट संख्या भरें'
        );
      }
    } else {
      this.longToast('अपराधी :- ज्ञात , अज्ञात चुनें');
    }
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
    this.listofDharaType = value.dhara_data;
    this.ListofPrajati = value.prajati_name;
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
  }

  onDharaChange(selectedDharaIds: number[]) {
    // Merge dhara_comma_separated from all selected heads
    const allDharas = selectedDharaIds
      .map((id) => {
        const found = this.listofDharaType.find((item: any) => item.id === id);
        return found ? found.dhara_comma_separated.join(',') : '';
      })
      .join(',');

    this.filteredDharaList = allDharas
      .split(',')
      .map((dhara) => dhara.trim())
      .filter((dhara) => dhara.length > 0);

    console.log('Filtered Dhara List:', this.filteredDharaList);
  }

  async shortToast(msg: string) {
    if (!msg || msg.trim() === '') {
      console.warn('Attempted to show toast with empty message');
      return;
    }
    console.log(msg);
    await Toast.show({
      text: msg,
      duration: 'short', // 'short' (2s) or 'long' (3.5s)
      position: 'bottom', // 'top', 'center', or 'bottom'
    });
  }

  async longToast(msg: string) {
    console.log('--inside-long-toast--', msg);
    if (!msg || msg.trim() === '') {
      console.warn('Attempted to show toast with empty message');
      return;
    }
    console.log(msg);
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
    // Create a new array reference to ensure change detection
    this.photos = this.photos.filter((_, i) => i !== index);
    this.cdRef.detectChanges();
  }

  async takePic() {
    console.log('--inside-take-pic-function--');

    // Max photos check
    if (this.photos.length >= 5) {
      this.longToast('आप अधिकतम 5 फोटो ले सकते हैं');
      return;
    }

    try {
      // Check and request camera permissions
      const permission = await Camera.checkPermissions();
      console.log('Camera permission status:', permission);

      if (permission.camera !== 'granted' || permission.photos !== 'granted') {
        const result = await Camera.requestPermissions();
        console.log('Permission request result:', result);

        if (result.camera !== 'granted') {
          this.showPermissionAlert('Camera permission not granted');
          return;
        }
      }

      const image = await Camera.getPhoto({
        quality: 10,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        allowEditing: false, // Set to false to avoid issues with some Android devices
      });

      console.log('Image captured:', image);

      if (image.dataUrl) {
        // Create a new array to trigger change detection
        this.photos = [...this.photos, image.dataUrl];
        console.log(
          'Photo added successfully. Total photos:',
          this.photos.length
        );

        // Force change detection
        this.cdRef.detectChanges();
      } else {
        console.warn('No image data found in the response');
        this.longToast('फोटो कैप्चर करने में त्रुटि: कोई छवि डेटा नहीं मिला');
      }
    } catch (error: any) {
      console.error('Photo capture error:', error);
      this.longToast('फोटो कैप्चर करने में त्रुटि: ' + error?.message);
    }
  }
}
