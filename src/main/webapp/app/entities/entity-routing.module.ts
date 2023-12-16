import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'food',
        data: { pageTitle: 'foodApp.food.home.title' },
        loadChildren: () => import('./food/food.module').then(m => m.FoodModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'foodApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'order-item',
        data: { pageTitle: 'foodApp.orderItem.home.title' },
        loadChildren: () => import('./order-item/order-item.module').then(m => m.OrderItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
