import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechtotextService {
  private recognition: any;
  private isListening = false;
  private textSubject = new BehaviorSubject<string>('');
  private errorSubject = new BehaviorSubject<string>('');
  private listeningSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeRecognition();
  }
  private initializeRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.setupRecognition();
    } else {
      console.error('Speech Recognition not supported in this browser');
    }
  }

  private setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.listeningSubject.next(true);
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      this.textSubject.next(finalTranscript || interimTranscript);
    };

    this.recognition.onerror = (event: any) => {
      this.errorSubject.next(event.error);
      this.isListening = false;
      this.listeningSubject.next(false);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.listeningSubject.next(false);
    };
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  getText(): Observable<string> {
    return this.textSubject.asObservable();
  }

  getError(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getListeningStatus(): Observable<boolean> {
    return this.listeningSubject.asObservable();
  }

  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}
