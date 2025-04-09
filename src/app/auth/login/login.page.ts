import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonInput,
  IonList,
  IonButtons,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { MatIconModule } from '@angular/material/icon';
import { eye, eyeOff, eyeOutline } from 'ionicons/icons';
import {
  MatInput,
  MatLabel,
  MatFormField,
  MatHint,
  MatError,
} from '@angular/material/input';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements MyErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonRadioGroup,
    IonList,
    IonInput,
    IonItem,
    IonContent,
    CommonModule,
    FormsModule,
    IonImg,
    IonButton,
    IonLabel,
    IonText,
    ReactiveFormsModule,
    IonIcon,
    MatInput,
    MatLabel,
    MatFormField,
    MatHint,
    MatError,
    ReactiveFormsModule,
    MatIconModule,
    IonButton,
    IonRadio,
  ],
  providers: [ApiService],
})
export class LoginPage implements OnInit {
  constructor(private router: Router) {
    addIcons({ eyeOutline, eye, eyeOff });
  }

  on_login() {
    console.log('hello');
    this.router.navigate(['dashboard']);
  }
  ngOnInit() {}
}
