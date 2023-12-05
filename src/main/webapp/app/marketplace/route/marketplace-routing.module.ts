import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { NgModule } from '@angular/core';
import { FoodListComponent } from '../food-list/food-list.component';
import { FoodDetailComponent } from '../food-detail/food-detail.component';
import foodResolve from 'app/entities/food/route/food-routing-resolve.service';

const marketplaceRoute: Routes = [
  {
    path: '',
    component: FoodListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/detail',
    component: FoodDetailComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    resolve: {
      food: foodResolve,
    },
    canActivate: [UserRouteAccessService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(marketplaceRoute)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule {}
