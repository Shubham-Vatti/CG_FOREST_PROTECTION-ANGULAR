import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) {}

  async show(message: string = 'Please wait...') {
    this.loading = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
      translucent: true,
      cssClass: 'custom-loader',
    });
    await this.loading.present();
  }

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
