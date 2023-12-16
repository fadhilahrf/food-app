import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';

@Component({
  templateUrl: './order-delete-dialog.component.html',
})
export class OrderDeleteDialogComponent {
  order?: IOrder;

  constructor(
    protected orderService: OrderService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.orderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
