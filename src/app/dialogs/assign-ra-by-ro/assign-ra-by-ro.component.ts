import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GetRAResponseModal } from './GetRAResponse.modal';

import { ModalController } from '@ionic/angular/standalone';

import { IonicModule } from '@ionic/angular';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';

import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-assign-ra-by-ro',
  templateUrl: './assign-ra-by-ro.component.html',
  styleUrls: ['./assign-ra-by-ro.component.scss'],
  imports: [IonicModule, NgSelectModule, FormsModule],
})
export class AssignRaByRoComponent implements OnInit {
  @Input() complain_table_id!: string;
  @Input() complain_history_table_id!: string;
  @Input() loginedOffierEmpId!: string;
  @Input() loginedOffierDesignationId!: string;

  listOfRA: GetRAResponseModal[] = [];
  selectedRAId: any = null;
  ro_remark: string = '';
  isLoading: boolean = false;
  loadingMessage: string = '';

  constructor(
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef
  ) {
    addIcons({ chevronDownOutline });
  }

  async ngOnInit() {
    const storedUser = await Preferences.get({ key: 'loginData' });
    if (storedUser && storedUser.value) {
      const userData = JSON.parse(storedUser.value);
      this.getRAList({
        emp_id: userData.data[0]?.emp_id,
        designation_id: userData.data[0]?.designation_id,
      });
    }
  }

  getRAList(data: any) {
    this.showDialog('कृपया प्रतीक्षा करें.....');
    this.apiService
      .getRAList(data)
      .then((response: any) => {
        this.dismissDialog();
        this.cdRef.detectChanges;
        if (response.response.code === 200) {
          this.listOfRA = response.data;
          console.log('LIST_OF_RA', response.data);
          this.cdRef.detectChanges();
        } else {
          this.showError(response.response.msg);
        }
      })
      .catch((error: any) => {
        //await this.dismissLoading();
        this.dismissDialog();
        this.showError(error);
        //this.apiService.showServerMessages(error)
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

  cancel() {
    this.modalCtrl.dismiss();
  }

  clickToAssignRA() {
    if (this.selectedRAId === null) {
      this.showError('कृपया RA चुने');
      return;
    }

    this.modalCtrl.dismiss({
      confirmed: true,
      remark: this.ro_remark,
      selected_ra: this.selectedRAId.toString(),
      complain_history_table_id: this.complain_history_table_id.toString(),
      complain_table_id: this.complain_table_id.toString(),
    });

    // this.apiService.assignRA(
    //   this.complain_history_table_id.toString(),
    //   this.complain_table_id.toString(),
    //   this.loginedOffierEmpId.toString(),
    //   this.selectedRAId.toString(),
    //   this.ro_remark.toString()
    // ).subscribe(
    //   async (response) => {

    //     await this.dismissDialog();
    //     this.cdRef.detectChanges;

    //     if (response.response.code === 200) {

    //       this.cdRef.detectChanges();

    //     } else {
    //       this.showError(response.response.msg)
    //     }

    //   },
    //   async (error) => {
    //     //await this.dismissLoading();
    //     await this.dismissDialog();
    //     this.showError(error);
    //     //this.apiService.showServerMessages(error)
    //   }
    // );
  }

  async showError(errorMsg: string) {
    try {
      const modal = await this.modalCtrl.create({
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
}
