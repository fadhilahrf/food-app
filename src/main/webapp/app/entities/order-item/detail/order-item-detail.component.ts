import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { IOrderItem } from '../order-item.model';

@Component({
  selector: 'jhi-order-item-detail',
  templateUrl: './order-item-detail.component.html'
})
export class OrderItemDetailComponent implements OnInit {
  @Input() orderItem: IOrderItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      this.orderItem = orderItem;
    });
  }


  previousState(): void {
    window.history.back();
  }
}
