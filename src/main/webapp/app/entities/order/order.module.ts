import { NgModule } from "@angular/core";
import SharedModule from "app/shared/shared.module";
import { OrderRoutingModule } from "./route/order-routing.module";
import { OrderComponent } from "./list/order.component";
import { OrderDetailComponent } from "./detail/order-detail.component";
import { OrderUpdateComponent } from "./update/order-update.component";
import { OrderDeleteDialogComponent } from "./delete/order-delete-dialog.component";

@NgModule({
    imports: [SharedModule, OrderRoutingModule],
    declarations: [
        OrderComponent,
        OrderDetailComponent,
        OrderUpdateComponent,
        OrderDeleteDialogComponent
    ]
})
export class OrderModule {}