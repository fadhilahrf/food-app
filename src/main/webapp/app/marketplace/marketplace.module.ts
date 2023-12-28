import { NgModule } from "@angular/core";
import SharedModule from "app/shared/shared.module";
import { MarketplaceRoutingModule } from "./route/marketplace-routing.module";
import { FoodListComponent } from "./food-list/food-list.component";
import { FoodDetailComponent } from "./food-detail/food-detail.component";
import { FoodRecommendationComponent } from './directives/food-recommendation/food-recommendation.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';

@NgModule({
    imports: [SharedModule, MarketplaceRoutingModule],
    declarations: [
        FoodListComponent,
        FoodDetailComponent,
        FoodRecommendationComponent,
        CartComponent,
        OrdersComponent,
        OrderDetailComponent,
        PaymentStatusComponent
    ]
})
export class MarketplaceModule {}