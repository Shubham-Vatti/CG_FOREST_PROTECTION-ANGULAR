import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpeechtotextService } from '../services/speechrecognition/speechtotext.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  imports:[
    CommonModule,
    FormsModule,
    IonicModule
    ]
})
export class TestingComponent  implements OnInit {
  transcribedText: string = '';
  errorMessage: string = '';
  isListening: boolean = false;
  isSupported: boolean = false;
  selectedLanguage: string = 'hi-IN';
  
  private subscriptions: Subscription[] = [];

  constructor(public speechService: SpeechtotextService) {}

  ngOnInit() {
    this.isSupported = this.speechService.isSupported();
    
    if (this.isSupported) {
      this.setupSubscriptions();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupSubscriptions() {
    // Subscribe to transcribed text
    this.subscriptions.push(
      this.speechService.getText().subscribe(text => {
        this.transcribedText = text;
      })
    );

    // Subscribe to errors
    this.subscriptions.push(
      this.speechService.getError().subscribe(error => {
        this.errorMessage = error;
      })
    );

    // Subscribe to listening status
    this.subscriptions.push(
      this.speechService.getListeningStatus().subscribe(status => {
        this.isListening = status;
      })
    );
  }

  startRecording() {
    if (this.isSupported) {
      this.errorMessage = '';
      this.speechService.startListening();
    }
  }

  stopRecording() {
    if (this.isSupported) {
      this.speechService.stopListening();
    }
  }

  toggleRecording() {
    if (this.isListening) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  clearText() {
    this.transcribedText = '';
    this.errorMessage = '';
  }

  setLanguage(language: string) {
    this.selectedLanguage = language;
    this.speechService.setLanguage(language);
  }

  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}
