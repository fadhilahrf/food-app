import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { NgModule } from '@angular/core';
import { FoodListComponent } from '../food-list/food-list.component';
import { FoodDetailComponent } from '../food-detail/food-detail.component';
import { foodVMResolve } from 'app/entities/food/route/food-routing-resolve.service';
import { CartComponent } from '../cart/cart.component';
import { orderCartResolve } from 'app/entities/order/route/order-routing-resolve.service';

const marketplaceRoute: Routes = [
  {
    path: '',
    component: FoodListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/detail',
    component: FoodDetailComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    resolve: {
      foodVM: foodVMResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: 'cart',
    component: CartComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    resolve: {
      order: orderCartResolve,
    },
    canActivate: [UserRouteAccessService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(marketplaceRoute)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule {}
