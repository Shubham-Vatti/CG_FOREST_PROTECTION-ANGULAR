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
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  ],
})
export class LoginPage implements OnInit {
  currentLang = 'en';
  constructor(private router: Router, private translate: TranslateService) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    this.currentLang = browserLang ?? 'en';
    translate.use(this.currentLang);
  }

  ngOnInit() {}

  // constructor() {
  // }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  on_login() {
    // console.log('hello');
    this.router.navigate(['/menu/dashboard']);
  }
}
