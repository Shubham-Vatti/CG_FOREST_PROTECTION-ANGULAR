import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonTextarea,
  IonLabel,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IonicModule, Platform } from '@ionic/angular'; // Import IonicModule
import { vfs as vfsRegular } from '../../assets/vfs_fonts_custom'; // adjust the path if needed
import { vfs as vfsBold } from '../../assets/vfs_fonts_bold_custom'; // adjust the path if needed
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
// import { LanguageServiceService } from 'src/app/services/languageServices/language-service.service';

import { NavController, ModalController } from '@ionic/angular/standalone';
// import { ComplainDetails } from '../officer-dashboard/GetDashboardResponse.model';

import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  archive,
  arrowBack,
  calendar,
  calendarOutline,
  cameraOutline,
  checkmarkCircleOutline,
  clipboard,
  closeCircle,
  closeCircleOutline,
  documentText,
  locationOutline,
  mapOutline,
  people,
  person,
  personCircle,
  refreshCircleOutline,
  warning,
} from 'ionicons/icons';
import pdfMake from 'pdfmake/build/pdfmake';
import { ApproveRejectComponent } from 'src/app/dialogs/approve-reject/approve-reject.component';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { SharedserviceService } from 'src/app/services/sharedService/sharedservice.service';
import { AlertController } from '@ionic/angular';
import { ImagePreviewModalComponent } from 'src/app/dialogs/image-preview-modal/image-preview-modal.component';
import { ApiService } from '../services/api.service';
import { PORFormDataprops } from '../pages/por-form-list/por-form-list.model';
import { UserLoginResponse } from '../login/login_response.model';
import { TranslateModule } from '@ngx-translate/core';
import { MasterDataProps } from 'src/assets/models/reusable.model';
import { SQLiteService } from '../services/localstorage/sqlite.service';

const mergedVfs = {
  ...vfsRegular,
  ...vfsBold,
};

@Component({
  selector: 'app-view-complain-detail',
  templateUrl: './view-complain-detail.page.html',
  styleUrls: ['./view-complain-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
  providers: [File, AndroidPermissions, SocialSharing],
})
export class ViewComplainDetailPage implements OnInit {
  photos: string[] = [];
  imageBaseUrl: string = 'https://6975-117-254-215-10.ngrok-free.app/uploads/';
  private androidPermissions = inject(AndroidPermissions);
  private socialSharing = inject(SocialSharing);
  isLoading: boolean = false;
  loadingMessage: string = 'Please wait.....';

  lat: string = '0';
  lon: string = '0';
  complain_location_google_addres: string = '';
  accussedName: string = '';
  accussedFatherName: string = '';
  address: string = '';
  accussedCast: string = '';
  crimType: string = '';
  crimeDate: string = '';
  witness1: string = '';
  witness2: string = '';
  addressWitness1: string = '';
  addressWitness2: string = '';
  crimePlace: string = '';
  seizedGoodDetail: string = '';
  porno: string = '';
  compartmentNumber: string = '';
  imgurl!: string;
  crime_dhara: string = '';
  japtSamanList: any[] = [];
  listOfjaptiSaman: any[] = [];
  getRaWorkLogList: any[] = [];

  comingComplaintData!: PORFormDataprops;
  is_pending = false;
  constructor(
    private alertCtrl: AlertController,
    private sharedService: SharedserviceService,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private modalCtrl: ModalController,
    private router: Router,
    private navController: NavController,
    private platForm: Platform,
    private file: File,
    private sqliteService: SQLiteService
  ) {
    addIcons({
      mapOutline,
      closeCircle,
      cameraOutline,
      arrowBack,
      locationOutline,
      refreshCircleOutline,
      calendarOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      documentText,
      personCircle,
      people,
      archive,
      warning,
      person,
      clipboard,
      calendar,
    });
  }

  async generatePDF() {
    this.longToast('पीडीएफ डाउनलोड हो रहा है...');
    (pdfMake as any).vfs = mergedVfs;

    (pdfMake as any).fonts = {
      NotoSansDevanagari: {
        normal: 'NotoSansDevanagari-Regular.ttf',
        bold: 'NotoSansDevanagari-Bold.ttf',
        italics: 'NotoSansDevanagari-Regular.ttf',
        bolditalics: 'NotoSansDevanagari-Regular.ttf',
      },
    };

    const tableBody = [
      [
        { text: 'सामान का प्रकार', bold: true },
        { text: 'प्रजाति का नाम', bold: true },
        { text: 'लम्बाई', bold: true },
        { text: 'गोलाई', bold: true },
        { text: 'नग', bold: true },
        { text: 'घन मीटर', bold: true },
        { text: 'दर', bold: true },
        { text: 'कुल राशी', bold: true },
        { text: 'अन्य जानकारी', bold: true },
      ],
      ...this.japtSamanList.map((item: any) => [
        item.jabti_saman_type == 1
          ? 'ठूंठ'
          : item.jabti_saman_type == 2
          ? 'काष्ठ'
          : 'अन्य',
        item.prajati_name || '',
        item.lambai || 0,
        item.golai || 0,
        item.nag || 0,
        item.ghan_meter || 0,
        item.dar || 0,
        item.total_cost || 0,
        item.if_other_then_detail || '',
      ]),
    ];

    const docDefinition: any = {
      content: [
        { text: 'वन विभाग Forest Department', style: 'title' },
        { text: 'Forest Department', style: 'title' },
        { text: 'प्रारंभिक अपराध प्रतिवेदन', style: 'subTitle' },
        { text: 'Preliminary Offence Report', style: 'subTitle' },
        {
          text: this.comingComplaintData.beat_name + ' बीट, छत्तीसगढ़',
          style: 'subTitle',
        },
        {
          columns: [
            {
              text: [
                'पुस्तक क्रमांक ',
                { text: this.comingComplaintData.por_number, style: 'section' },
              ],
            },
            {
              text: [
                'तारीख ',
                { text: this.comingComplaintData.date_of_crime, bold: true },
              ],
              alignment: 'right',
            },
          ],
        },

        { text: '\n' },

        { text: '\n' },

        {
          text: [
            '1. मुजरिम का नाम ',
            {
              text: this.comingComplaintData.accused_name || 'अज्ञात',
              bold: true,
            },
            ' , पिता का नाम ',
            {
              text: this.comingComplaintData.accused_fathers_name || 'अज्ञात',
              bold: true,
            },
            ', जाति ',
            {
              text: this.comingComplaintData.cast_name || 'अज्ञात',
              bold: true,
            },
            ' और सकूनत  ___________________',
          ],
        },

        { text: '\n' },

        {
          text: [
            '2. किस्म जुर्म ',
            { text: this.comingComplaintData.crime_dhara, bold: true },
          ],
        },

        { text: '\n' },

        {
          text: [
            '3. जगह जहाँ जुर्म हुआ (कक्ष क्रमांक)',
            { text: this.comingComplaintData.compartment_number, bold: true },
          ],
        },

        { text: '\n' },

        {
          text: [
            '4. जुर्म की तारीख ',
            { text: this.comingComplaintData.date_of_crime, bold: true },
          ],
        },

        { text: '\n' },

        { text: '5. तफ्सील जप्त शुदा माल का विवरण' },
        {
          margin: [0, 10, 0, 10],
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', '*', '*', '*', '*', '*', '*'],
            body: tableBody,
          },
        },
        // {
        //   canvas: [
        //     { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
        //   ],
        //   margin: [0, 10, 0, 10]
        // },

        { text: '\n' },

        {
          text: [
            '6. प्रथम नाम गवाहान ',
            { text: this.comingComplaintData.name_of_witness_one, bold: true },
            ' , द्वितीय नाम गवाहान ',
            { text: this.comingComplaintData.name_of_witness_two, bold: true },
          ],
        },

        { text: '\n' },

        {
          text: 'दूसरा भाग रेंज असिस्टेंट साहब ____________________ सर्किल को भेजा गया ',
        },

        { text: '\n' },

        {
          text: 'तीसरा भाग रेंज ऑफिसर साहब________________________________रेंज को भेजा गया',
        },

        { text: '\n' },

        {
          columns: [
            { text: 'मुकाम  ' },
            {
              text: 'दस्तखत फारेस्ट गॉर्ड _______________________',
              alignment: 'right',
            },
          ],
          margin: [0, 10, 0, 0],
        },

        { text: '\n' },

        {
          columns: [
            { text: 'तारीख  ____________________________' },
            { text: 'नाका _______________________', alignment: 'right' },
          ],
          margin: [0, 10, 0, 0],
        },

        { text: '\n' },

        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 10],
        },

        { text: '\n' },

        {
          text: 'नोट: यह रिपोर्ट जुर्म मालूम होने के 48 घंटे के अंदर बमूजिब पैरा 77 (अ) (3) फारेस्ट मैनुअल भाग 1 के अपने आला ऑफिसर के पास भेज दी जानी चाहिए |',
          bold: true,
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        title: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        subTitle: {
          fontSize: 14,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        section: {
          bold: true,
          margin: [0, 10, 0, 2],
        },
      },
      defaultStyle: {
        font: 'NotoSansDevanagari',
        fontSize: 12,
      },
    };

    if (this.platForm.is('desktop')) {
      pdfMake
        .createPdf(docDefinition)
        .download(this.comingComplaintData.por_number + '.pdf');
    } else if (this.platForm.is('android')) {
      await this.checkAndRequestStoragePermission();

      pdfMake.createPdf(docDefinition).getBase64(async (base64Data: string) => {
        console.log('Base64DataOfPDF', base64Data);

        const fileName = this.comingComplaintData.por_number + '.pdf';

        const fileURI = await this.savePdf(base64Data, fileName);
        console.log('--saved-uriiiiiiiiiiiiiiiii-------------------', fileURI);
        // await this.androidPermissions.requestPermissions([
        //   this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        //   this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        // ]);

        // await Filesystem.writeFile({
        //   path: fileName,
        //   data: base64Data,
        //   directory: Directory.Documents,
        //   encoding: 'base64' as any,
        // });

        // console.log('PDF saved successfully');

        // const fileInfo = await Filesystem.getUri({
        //   path: fileName,
        //   directory: Directory.Documents,
        // });

        // const filePath = fileInfo.uri;

        // await Share.share({
        //   title: 'PDF Report',
        //   text: 'Please find the PDF attached.',
        //   url: filePath,
        //   dialogTitle: 'Share PDF'
        // });
      });
    }
  }

  async checkAndRequestStoragePermission() {
    const result = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    );

    if (!result.hasPermission) {
      await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      );
    }
  }

  async savePdf(base64Data: string, fileName: string) {
    fileName = fileName.replace(/\//g, '_');
    const cleanedBase64 = base64Data.replace(/\s/g, '').trim();

    await this.platForm.ready();

    const filePath = this.file.externalDataDirectory || this.file.dataDirectory;

    await this.file.writeFile(
      filePath,
      fileName,
      this.convertBase64ToBlob(cleanedBase64, 'application/pdf'),
      { replace: true }
    );

    const result = await Filesystem.getUri({
      path: fileName,
      directory: Directory.External,
    });

    this.socialSharing.share(
      '📄 Here is your PDF report.',
      'PDF Report',
      filePath + fileName,
      undefined
    );
  }

  convertBase64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  formatWorkLogDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  async ngOnInit() {
    this.getLoginedOfficerDetail();

    const nav = this.router.getCurrentNavigation();
    const data = nav?.extras.state?.['data'];
    console.log('--view-dadadadadada--', data);
    if (data) {
      // Convert plain object back to model
      this.comingComplaintData = JSON.parse(data) as PORFormDataprops;

      console.log(
        '--comming-datataartata---',
        this.comingComplaintData.complain_id,
        '--',
        typeof this.comingComplaintData
      );
      await this.apiService
        .getRAWorkLog({
          complain_id: this.comingComplaintData.complain_id,
        })
        .then((circleObservable) => {
          circleObservable.subscribe({
            next: async (data) => {
              if (data.response.code == 200) {
                this.getRaWorkLogList = data.data;
              }
            },
            error: (err) => {
              console.error('Circle API error:', err);
            },
          });
        });
      this.accussedName = this.comingComplaintData.accused_name;
      this.accussedFatherName = this.comingComplaintData.accused_fathers_name;
      this.address = this.comingComplaintData.accused_address;
      this.accussedCast = this.comingComplaintData.cast_name;
      this.crimType = this.comingComplaintData.crime_type;
      this.crimeDate = this.comingComplaintData.date_of_crime;
      this.witness1 = this.comingComplaintData.name_of_witness_one;
      this.witness2 = this.comingComplaintData.name_of_witness_two;
      this.addressWitness1 = this.comingComplaintData.address_of_witness_one;
      this.addressWitness2 = this.comingComplaintData.address_of_witness_two;
      this.crimePlace = this.comingComplaintData.place_of_crime;
      this.seizedGoodDetail = this.comingComplaintData.details_of_seized_goods;
      this.lat = this.comingComplaintData.lat;
      this.lon = this.comingComplaintData.lng;
      this.complain_location_google_addres =
        this.comingComplaintData.map_address;
      this.imgurl = this.comingComplaintData.imageUrl;
      this.porno = this.comingComplaintData.por_number;
      this.crime_dhara = this.comingComplaintData.crime_dhara;
      this.japtSamanList = this.comingComplaintData.japtSamanList;
      this.compartmentNumber = this.comingComplaintData.compartment_number;
      if (this.comingComplaintData.show_approve_reject_button === '1') {
        this.is_pending = true;
      } else {
        this.is_pending = false;
      }
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
    let msg = '';

    if (approveOrReject === '1') {
      msg = 'स्वीकृत टिप्पणी लिखें';
    } else if (approveOrReject === '2') {
      msg = 'अस्वीकृत टिप्पणी लिखें';
    }

    const modal = await this.modalCtrl.create({
      component: ApproveRejectComponent,
      cssClass: 'custom-dialog-modal',
      componentProps: {
        remarkLabel: msg,
        approved_or_reject: approveOrReject,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.confirmed) {
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
    this.showDialog('कृपया प्रतीक्षा करें.....');

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

  loginedOffierEmpId: number = 0;
  Officerdesignation: string = '';

  async getLoginedOfficerDetail() {
    const value: MasterDataProps = await this.sqliteService.getOfflineData();
    this.loginedOffierEmpId = value.data[0].emp_id;
    this.Officerdesignation = value.data[0].designation_name;
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
        imageUrl: imageUrl,
      },
      backdropDismiss: true,
    });

    await modal.present();
  }
}
