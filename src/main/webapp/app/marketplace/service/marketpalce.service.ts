import { Injectable } from "@angular/core";
import { IFood, IFoodVM } from "app/entities/food/food.model";
import { IOrderItem } from "app/entities/order-item/order-item.model";
import { OrderItemService } from "app/entities/order-item/service/order-item.service";
import { OrderService } from "app/entities/order/service/order.service";
import { DataService } from "app/shared/service/data.service";

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
    
}
