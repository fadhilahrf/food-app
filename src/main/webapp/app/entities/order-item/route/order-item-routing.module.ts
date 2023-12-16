import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { NgModule } from '@angular/core';
import { OrderItemComponent } from '../list/order-item.component';
import { OrderItemDetailComponent } from '../detail/order-item-detail.component';
import orderItemResolve from './order-item-routing-resolve.service';
import { OrderItemUpdateComponent } from '../update/order-item-update.component';

const orderItemRoute: Routes = [
  {
    path: '',
    component: OrderItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderItemDetailComponent,
    resolve: {
      orderItem: orderItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderItemUpdateComponent,
    resolve: {
      orderItem: orderItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderItemUpdateComponent,
    resolve: {
      orderItem: orderItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderItemRoute)],
  exports: [RouterModule]
})
export class OrderItemRoutingModule {}
