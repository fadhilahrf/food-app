import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PAYMENT_STATUS } from 'app/app.constants';

@Component({
  selector: 'jhi-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {
  PAYMENT_STATUS = PAYMENT_STATUS;
  status = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
    });
  }

}
