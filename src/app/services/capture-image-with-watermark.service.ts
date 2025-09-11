import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CaptureImageWithWatermarkService {
  async captureImageWithWatermark(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (!image || !image.dataUrl) throw new Error('Image capture failed');

    const watermarkedImage = await this.addWatermarkToImage(image.dataUrl);
    return watermarkedImage;
  }

  private async addWatermarkToImage(base64Image: string): Promise<string> {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = base64Image;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Watermark text
        const now = new Date();
        const watermarkText = now.toLocaleString();

        ctx!.font = 'bold 40px Arial';
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx!.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx!.lineWidth = 3;

        const x = 20;
        const y = canvas.height - 30;

        // Stroke for contrast
        ctx!.strokeText(watermarkText, x, y);
        ctx!.fillText(watermarkText, x, y);

        // Export new image
        const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(watermarkedDataUrl);
      };

      image.onerror = (err) => {
        console.error('Image load error', err);
      };
    });
  }

  constructor() {}
}
