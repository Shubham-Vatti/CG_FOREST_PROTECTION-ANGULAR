import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { addIcons } from 'ionicons';
import { closeCircle, closeCircleOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-image-preview-modal',
  templateUrl: './image-preview-modal.component.html',
  styleUrls: ['./image-preview-modal.component.scss'],
  imports: [IonicModule]
})
export class ImagePreviewModalComponent implements OnInit {
  @Input() imageUrl!: string;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeCircleOutline });
  }

  ngOnInit() { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
