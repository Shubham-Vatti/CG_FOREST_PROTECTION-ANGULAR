// network.service.ts
import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, from } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private networkStatus = new BehaviorSubject<boolean>(true);

  constructor(private toastController: ToastController) {
    this.initializeNetworkListener();
  }

  private async initializeNetworkListener() {
    const status = await Network.getStatus();
    this.networkStatus.next(status.connected);

    // Listen for network status changes
    Network.addListener('networkStatusChange', (status) => {
      this.networkStatus.next(status.connected);
      this.showToast(
        status.connected ? 'Network connected!' : 'Network disconnected!'
      );
    });
  }

  getNetworkStatus() {
    return this.networkStatus.asObservable();
  }

  async getCurrentStatus() {
    const status = await Network.getStatus();
    return status.connected;
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
