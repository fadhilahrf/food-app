import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { OrderItemService } from '../service/order-item.service';
import { IOrderItem } from '../order-item.model';
import { OrderItemFormService, OrderItemFormGroup } from './order-item-form.service';

@Component({
  selector: 'jhi-order-item-update',
  templateUrl: './order-item-update.component.html'
})
export class OrderItemUpdateComponent implements OnInit {
  isSaving = false;
  orderItem: IOrderItem | null = null;

  foodsSharedCollection: IFood[] = [];
  ordersSharedCollection: IOrder[] = [];

  editForm: OrderItemFormGroup = this.orderItemFormService.createOrderItemFormGroup();

  constructor(
    protected orderItemService: OrderItemService,
    protected orderItemFormService: OrderItemFormService,
    protected foodService: FoodService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareFood = (o1: IFood | null, o2: IFood | null): boolean => this.foodService.compareFood(o1, o2);

  compareOrder = (o1: IOrder | null, o2: IOrder | null): boolean => this.orderService.compareOrder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      this.orderItem = orderItem;
      if (orderItem) {
        this.updateForm(orderItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderItem = this.orderItemFormService.getOnlyOrderItem(this.editForm);
    orderItem.price = orderItem.quantity!*orderItem.food?.price!;
    if (orderItem.id !== null) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orderItem: IOrderItem): void {
    this.orderItem = orderItem;
    this.orderItemFormService.resetForm(this.editForm, orderItem);

    this.foodsSharedCollection = this.foodService.addFoodToCollectionIfMissing<IFood>(this.foodsSharedCollection, orderItem.food);
    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing<IOrder>(this.ordersSharedCollection, orderItem.order);
  }

  protected loadRelationshipsOptions(): void {
    this.foodService
      .query()
      .pipe(map((res: HttpResponse<IFood[]>) => res.body ?? []))
      .pipe(map((foods: IFood[]) => this.foodService.addFoodToCollectionIfMissing<IFood>(foods, this.orderItem?.food)))
      .subscribe((foods: IFood[]) => (this.foodsSharedCollection = foods));

    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing<IOrder>(orders, this.orderItem?.order)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));
  }
}
