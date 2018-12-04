import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
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
import { ProductsComponent } from './products.component';
import { ProductFormComponent } from './product-form/product-form.component';

const routes: Routes = [
    {
        path: '',
        component: ProductsComponent,
    },
];

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,
        RouterModule.forChild(routes),

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
    ],
    declarations: [
        ProductsComponent,
        ProductFormComponent,
    ],
    entryComponents: [
        ProductFormComponent,
    ],
})
export class ProductsModule {
}
