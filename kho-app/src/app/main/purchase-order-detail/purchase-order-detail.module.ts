import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';

import { PurchaseOrderDetailComponent } from './purchase-order-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatTabsModule, MatSelectModule } from '@angular/material';

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,
        RouterModule,

        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatSelectModule,
    ],
    declarations: [
        PurchaseOrderDetailComponent,
    ],
    exports: [
        PurchaseOrderDetailComponent,
    ],
})
export class PurchaseOrderDetailModule {
}
