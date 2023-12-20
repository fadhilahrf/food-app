import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceService } from '../service/marketpalce.service';
import { OrderService } from 'app/entities/order/service/order.service';
import { IOrder } from 'app/entities/order/order.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { IFoodVM } from 'app/entities/food/food.model';
import { IOrderItem } from 'app/entities/order-item/order-item.model';
import { DataService } from 'app/shared/service/data.service';
import { OrderItemService } from 'app/entities/order-item/service/order-item.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  order?: IOrder | null;
  foodVms?: IFoodVM[] | [];
  SHIPPING_COST = 5000;

  constructor(protected activatedRoute: ActivatedRoute, protected orderService: OrderService, protected orderItemService: OrderItemService, protected foodService: FoodService, protected marketplaceService: MarketplaceService, protected dataService: DataService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
    });
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
