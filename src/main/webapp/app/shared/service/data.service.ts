import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  data = new BehaviorSubject(null);
  data$ = this.data.asObservable();
  
  quantity = new BehaviorSubject(0);
  quantity$ = this.quantity.asObservable();

  setData(d: any): void {
    this.data.next(d);
  }

  setQuantity(d: any): void {
    this.quantity.next(d);
  }
}
