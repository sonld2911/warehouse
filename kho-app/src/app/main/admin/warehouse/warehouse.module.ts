import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatDialogModule, MatFormFieldModule,
    MatIconModule, MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { AppConfirmDialogModule, LoadingSpinnerModule } from '@shared/components';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';


@NgModule({
    imports: [
        FuseSharedModule,
        WarehouseRoutingModule,

        TranslateModule,
        LoadingSpinnerModule,
        AppConfirmDialogModule,

        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    declarations: [
        WarehouseComponent,
        WarehouseFormComponent,
        WarehouseListComponent,
    ],
    entryComponents: [
        WarehouseFormComponent,
    ],
})
export class WarehouseModule {
}
