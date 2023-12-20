import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IFood, IFoodVM } from "app/entities/food/food.model";
import { IOrderItem } from "app/entities/order-item/order-item.model";
import { OrderItemService } from "app/entities/order-item/service/order-item.service";
import { OrderService } from "app/entities/order/service/order.service";
import { DataService } from "app/shared/service/data.service";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
    
    constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private dataService: DataService
    ){}

    addFoodQuantity(foodVM: IFoodVM): void {
        foodVM.orderedQuantity = foodVM.orderedQuantity!+1;

        const orderItem: IOrderItem = {
            id: null,
            food: foodVM.food,
            quantity: foodVM.orderedQuantity
        };

        this.orderItemService.create(orderItem).subscribe(res=>{
            this.orderService.getTotalQuantity().subscribe(res2=>{
                const quantity = res2.body ? res2.body : 0;
                this.dataService.setQuantity(quantity);
            })
        })
    }

    substractFoodQuantity(foodVM: IFoodVM): void {
        if(foodVM.orderedQuantity!>0){
            foodVM.orderedQuantity = foodVM.orderedQuantity!-1;
            if(foodVM.orderedQuantity<0){
                foodVM.orderedQuantity = 0;
            }
    
            const orderItem: IOrderItem = {
                id: null,
                food: foodVM.food,
                quantity: foodVM.orderedQuantity
            };
    
            this.orderItemService.create(orderItem).subscribe(res=>{
                this.orderService.getTotalQuantity().subscribe(res2=>{
                    const quantity = res2.body ? res2.body : 0;
                    this.dataService.setQuantity(quantity);
                })
            })
        }
    }

    addOrderItemQuantity(orderItem: IOrderItem): Observable<HttpResponse<IOrderItem>> {
        orderItem.quantity = orderItem.quantity!+1;
        orderItem.price = orderItem.quantity*orderItem.food?.price!;
        
        return this.orderItemService.create(orderItem);
    }

    substractOrderItemQuantity(orderItem: IOrderItem): Observable<null | HttpResponse<IOrderItem>> {
        if(orderItem.quantity!>0){
            orderItem.quantity = orderItem!.quantity!-1;
            if(orderItem.quantity<0){
                orderItem.quantity= 0;
            }
            orderItem.price = orderItem.quantity*orderItem.food?.price!;
    
            return this.orderItemService.create(orderItem)
        }
        return of(null);
    }
}
