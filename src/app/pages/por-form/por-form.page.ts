import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButtons,
  IonMenuButton,
  IonImg,
  IonButton,
  IonDatetime,
  IonModal,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-por-form',
  templateUrl: './por-form.page.html',
  styleUrls: ['./por-form.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonLabel,
    IonItem,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonImg,
    IonButton,
    TranslateModule,
    IonDatetime,
    IonModal,
    ReactiveFormsModule,
  ],
})
export class PorFormPage implements OnInit {
  currentDate: string;
  selectedDate: string = '';
  showDatepicker = false;

  constructor() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Month is zero-based
    const year = today.getFullYear();

    // Format as DD-MM-YYYY
    this.currentDate = `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`;
  }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    this.showDatepicker = false;
  }

  openDatepicker() {
    this.showDatepicker = true;
  }

  searchControl = new FormControl('');
  items: string[] = ['Apple', 'Banana', 'Cherry', 'Mango', 'Pineapple'];
  filteredItems: string[] = [];
  selectedItem: string = '';

  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(() => {
      this.onSearch();
    });
  }

  onSearch() {
    const query = this.searchControl.value?.toLowerCase() || '';
    this.filteredItems = this.items.filter((item) =>
      item.toLowerCase().includes(query)
    );
  }

  selectItem(item: string) {
    this.selectedItem = item;
    this.searchControl.setValue(item, { emitEvent: false });
    this.filteredItems = [];
  }
}
