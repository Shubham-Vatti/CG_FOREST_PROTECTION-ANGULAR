import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private translations: any = {};
  private currentLang = 'en';

  constructor(private http: HttpClient) {}

  async use(lang: string): Promise<void> {
    this.currentLang = lang;
    const res = await firstValueFrom(
      this.http.get(`/assets/i18n/${lang}.json`)
    );
    this.translations = res;
  }
  instant(key: string): string {
    return this.translations[key] || key;
  }

  getCurrentLang(): string {
    return this.currentLang;
  }
}
