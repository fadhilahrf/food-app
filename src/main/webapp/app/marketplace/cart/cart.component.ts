import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceService } from '../service/marketpalce.service';
import { OrderService } from 'app/entities/order/service/order.service';
import { IOrder } from 'app/entities/order/order.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { IFoodVM } from 'app/entities/food/food.model';
import { IOrderItem } from 'app/entities/order-item/order-item.model';
import { DataService } from 'app/shared/service/data.service';
import { OrderItemService } from 'app/entities/order-item/service/order-item.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { OrderStatus } from 'app/entities/enumerations/order-status.model';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  order?: IOrder | null;
  foodVms?: IFoodVM[] | [];
  SHIPPING_COST = 5;
  payPalConfig ? : IPayPalConfig;
  showSuccess = false;
  showCancel = false;
  showError = false;
  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected orderService: OrderService, protected orderItemService: OrderItemService, protected foodService: FoodService, protected marketplaceService: MarketplaceService, protected dataService: DataService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      this.initConfig();
    });
  }
  
  private initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: String(this.order?.totalPrice!+this.SHIPPING_COST),
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: String(this.order?.totalPrice!+this.SHIPPING_COST)
                        }
                    }
                },
                items: []
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
        },
        onClientAuthorization: (data) => {
          this.orderService.setCurrentOrderStatus(OrderStatus.COOKING).subscribe(res=>{
            this.showSuccess = true;
            this.dataService.setQuantity(0);
            this.router.navigate(['/foods']);
          });

        },
        onCancel: (data, actions) => {
            this.showCancel = true;

        },
        onError: err => {
            this.showError = true;
        },
        onClick: (data, actions) => {
        }
    };
}

  addOrderItemQuantity(orderItem: IOrderItem): void {
    this.marketplaceService.addOrderItemQuantity(orderItem).subscribe(res=>{
      orderItem = res.body!;
      this.orderService.findByCurrentUserAndStatusIsActive().subscribe(res2=>{
        if(res2.body){
          this.order!.totalQuantity = res2.body.totalQuantity;
          this.order!.totalPrice = res2.body.totalPrice;
          this.dataService.setQuantity(this.order!.totalQuantity);
        }
      });
    });
  }

  substractOrderItemQuantity(orderItem: IOrderItem): void {
    this.marketplaceService.substractOrderItemQuantity(orderItem).subscribe(res=>{
      if(res){
        orderItem = res.body!;
        this.orderService.findByCurrentUserAndStatusIsActive().subscribe(res2=>{
          if(res2.body){
            if(res.body?.quantity==0){
              this.order!.orderItems = this.order?.orderItems?.filter(item=>item.id!=res.body?.id);
            }
            this.order!.totalQuantity = res2.body.totalQuantity;
            this.order!.totalPrice = res2.body.totalPrice;
            this.dataService.setQuantity(this.order!.totalQuantity);
          }
        });
      }
    });
  }

  deleteOrderItem(id: string): void {
    this.orderItemService.delete(id).subscribe(res=>{
      this.order!.orderItems = this.order?.orderItems?.filter(orderItem=>orderItem.id!=id);
      this.orderService.findByCurrentUserAndStatusIsActive().subscribe(res2=>{
        if(res2.body){
          this.order!.totalQuantity = res2.body.totalQuantity;
          this.order!.totalPrice = res2.body.totalPrice;
          this.dataService.setQuantity(this.order!.totalQuantity);
        }
      });
    });
  }
}
