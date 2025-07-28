import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { exitOutline, home, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule,TranslateModule],
})
export class MenuComponent implements OnInit {
  constructor(private router: Router,private translate:TranslateService) {
    addIcons({home,informationCircle,exitOutline})
  }

  public appPages = [
    { title: this.translate.instant('appbar.Title-Dashboard'), url: '/dashboard', icon: 'home' },
    { title: this.translate.instant('appbar.Title-POR'), url: '/por-form-list', icon: 'information-circle' },
  ];

  onMenuClick(page: string) {
    this.router.navigate(['menu' + page]);
  }
  ngOnInit() {}
}
