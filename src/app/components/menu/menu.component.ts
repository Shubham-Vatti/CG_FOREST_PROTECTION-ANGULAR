import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class MenuComponent implements OnInit {
  constructor(private router: Router) {}

  public appPages = [
    { title: 'dashboard', url: '/dashboard', icon: 'home' },
    { title: 'por-form', url: '/por-form', icon: 'information-circle' },
  ];

  onMenuClick(page: string) {
    this.router.navigate(['menu' + page]);
  }
  ngOnInit() {}
}
