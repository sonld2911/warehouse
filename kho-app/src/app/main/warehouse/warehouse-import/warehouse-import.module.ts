import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { AppConfirmDialogModule } from '@shared/components';
import { PurchaseOrderSearchDialogModule } from '@app/main/warehouse/purchase-order-search-dialog';

import { WarehouseImportComponent } from './warehouse-import/warehouse-import.component';
import { WarehouseImportFormComponent } from './warehouse-import-form';
// import { WarehouseImportDetailComponent } from './warehouse-import-detail/warehouse-import-detail.component';
import { ProductSearchDialogModule } from '@app/main/warehouse/product-search-dialog/product-search-dialog.module';
import { ProductStoreService } from '@app/main/warehouse/product-store.service';
import { PurchaseOrderDetailComponent, PurchaseOrderDetailModule } from '@app/main/purchase-order-detail';

const routes: Routes = [
    {
        path: 'new',
        component: WarehouseImportFormComponent,
    },
    {
        path: 'edit/:id',
        component: WarehouseImportFormComponent,
    },
    {
        path: 'detail/:id',
        component: PurchaseOrderDetailComponent,
    },
    {
        path: '',
        component: WarehouseImportComponent,
    },
];

@NgModule({
    imports: [
        FuseSharedModule,
        RouterModule.forChild(routes),

        TranslateModule,
        AppConfirmDialogModule,

        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatRippleModule,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,

        PurchaseOrderSearchDialogModule,
        ProductSearchDialogModule,

        PurchaseOrderDetailModule,
    ],
    declarations: [
        WarehouseImportComponent,
        WarehouseImportFormComponent,
        // WarehouseImportDetailComponent,
    ],
    entryComponents: [
        WarehouseImportFormComponent,
        // WarehouseImportDetailComponent,
    ],
    providers: [
        ProductStoreService,
    ]
})
export class WarehouseImportModule {
}
