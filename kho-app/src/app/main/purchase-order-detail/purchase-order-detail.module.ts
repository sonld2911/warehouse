import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';

import { PurchaseOrderDetailComponent } from './purchase-order-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatTabsModule } from '@angular/material';

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,
        RouterModule,

        MatIconModule,
        MatButtonModule,
        MatTabsModule,
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
