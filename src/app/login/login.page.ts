import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonImg,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonIcon,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { LoginResponseModel } from './login_response.model';
import { LoaderService } from '../services/loader.service';
import { SQLiteService } from '../services/localstorage/sqlite.service';
import { addIcons } from 'ionicons';
import { eye } from 'ionicons/icons';
import { NetworkService } from '../services/internetnetwork/network.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonImg,
    IonRadio,
    IonRadioGroup,
    TranslateModule,
    IonGrid,
    IonRow,
    IonCol,
    IonCheckbox,
    IonIcon,
    IonInputPasswordToggle,
  ],
})
export class LoginPage implements OnInit {
  currentLang: string;
  username: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private platform: Platform,
    private apiService: ApiService,
    private loader: LoaderService, // <-- inject loader service
    private sqliteService: SQLiteService,
    private networkservice: NetworkService
  ) {
    addIcons({ eye });
    this.currentLang = this.translate.currentLang;
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    this.currentLang = browserLang ?? 'en';
    translate.use(this.currentLang);
  }

  ngOnInit() {}

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  async on_login() {
    try {
      if (await this.networkservice.getCurrentStatus()) {
        if (this.username) {
          if (this.password) {
            await this.loader.show(this.translate.instant('auth.loadertxt'));
            let data = {
              username: this.username,
              password: this.password,
              firebase_token: '',
            };
            console.log('Login data:', data);

            (await this.apiService.User_Login(data)).subscribe({
              next: async (response: LoginResponseModel) => {
                await this.loader.hide();
                if (response.response.code === 200) {
                  this.loader.hide();

                  await this.sqliteService.storeLoginData(
                    response,
                    this.currentLang
                  );

                  this.router.navigate(['menu/dashboard']);
                } else {
                  this.loader.hide();
                  alert(response.response.msg);
                }
              },
            });
          } else {
            alert(this.translate.instant('auth.alertpassword'));
          }
        } else {
          alert(this.translate.instant('auth.alertusername'));
        }
      } else {
        alert('Please connect with internet');
      }
    } catch (err) {
      this.loader.hide();
      console.log('--console-log-data--', err);
    }
  }
}
