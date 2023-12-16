import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { NgModule } from '@angular/core';
import { OrderComponent } from '../list/order.component';
import { OrderDetailComponent } from '../detail/order-detail.component';
import orderResolve from './order-routing-resolve.service';
import { OrderUpdateComponent } from '../update/order-update.component';

const orderRoute: Routes = [
  {
    path: '',
    component: OrderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderDetailComponent,
    resolve: {
      order: orderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderUpdateComponent,
    resolve: {
      order: orderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderUpdateComponent,
    resolve: {
      order: orderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderRoute)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
