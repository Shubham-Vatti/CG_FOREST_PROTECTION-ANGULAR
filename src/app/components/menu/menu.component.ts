import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { home, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule,TranslateModule],
})
export class MenuComponent implements OnInit {
  constructor(private router: Router) {
    addIcons({home,informationCircle})
  }

  public appPages = [
    { title: 'dashboard', url: '/dashboard', icon: 'home' },
    { title: 'por', url: '/por-form-list', icon: 'information-circle' },
  ];

  onMenuClick(page: string) {
    this.router.navigate(['menu' + page]);
  }
  ngOnInit() {}
}
