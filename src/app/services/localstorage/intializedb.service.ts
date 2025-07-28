import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class IntializedbService {
  constructor(private sqliteService: SQLiteService) {}
}
