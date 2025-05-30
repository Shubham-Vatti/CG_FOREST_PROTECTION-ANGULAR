import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

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
  ],
})
export class LoginPage implements OnInit {
  currentLang: string;
  mobile_no:string = '';
  password: string = '';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private platform: Platform,
    private apiService: ApiService
  ) {
    this.currentLang = this.translate.currentLang;
    console.log(this.currentLang);
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    this.currentLang = browserLang ?? 'en';
    translate.use(this.currentLang);
  }

  // platformdata = this.platform.;
  ngOnInit() {}

  // constructor() {
  // }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  on_login() {
    if(this.mobile_no)
    {
      if(this.password)
      {
    let data={
    mobile:this.mobile_no,
    password:this.password
    }
    this.apiService.User_Login(data).subscribe((resp) => {
            console.log('--response--',resp);
        });
      }
      else{
        alert("Please enter password");
      }
    // this.router.navigate(['/menu/dashboard']);
  }
  else{
    alert("Please enter mobile number");
  }
    }
}
