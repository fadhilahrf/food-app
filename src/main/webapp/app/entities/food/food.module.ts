import { NgModule } from "@angular/core";
import SharedModule from "app/shared/shared.module";
import { FoodRoutingModule } from "./route/food-routing.module";
import { FoodComponent } from "./list/food.component";
import { FoodDetailComponent } from "./detail/food-detail.component";
import { FoodUpdateComponent } from "./update/food-update.component";
import { CropImageModalComponent } from "./crop-image-modal/crop-image-modal.component";
import { FoodDeleteDialogComponent } from "./delete/food-delete-dialog.component";

@NgModule({
    imports: [SharedModule, FoodRoutingModule],
    declarations: [
        FoodComponent,
        FoodDetailComponent,
        FoodUpdateComponent,
        FoodDeleteDialogComponent,
        CropImageModalComponent
    ]
})
export class FoodModule {}