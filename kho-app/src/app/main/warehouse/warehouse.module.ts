import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';

import { WarehouseRoutingModule } from './warehouse-routing.module';


@NgModule({
    imports: [
        FuseSharedModule,
        WarehouseRoutingModule,
    ],
    declarations: [],
})
export class WarehouseModule {
}
