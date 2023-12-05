import { NgModule } from "@angular/core";
import SharedModule from "app/shared/shared.module";
import { MarketplaceRoutingModule } from "./route/marketplace-routing.module";
import { FoodListComponent } from "./food-list/food-list.component";
import { FoodDetailComponent } from "./food-detail/food-detail.component";

@NgModule({
    imports: [SharedModule, MarketplaceRoutingModule],
    declarations: [
        FoodListComponent,
        FoodDetailComponent
    ]
})
export class MarketplaceModule {}