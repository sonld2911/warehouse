import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { PurchaseOrderSearchDialogComponent } from './purchase-order-search-dialog.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,
        NgxDaterangepickerMd,

        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
    ],
    declarations: [
        PurchaseOrderSearchDialogComponent,
    ],
    entryComponents: [
        PurchaseOrderSearchDialogComponent,
    ],
    exports: [
        PurchaseOrderSearchDialogComponent,
    ],
})
export class PurchaseOrderSearchDialogModule {
}
