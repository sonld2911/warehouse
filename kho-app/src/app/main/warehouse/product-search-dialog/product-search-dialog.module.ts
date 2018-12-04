import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';

import { ProductSearchDialogComponent } from './product-search-dialog.component';

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatChipsModule,
    ],
    declarations: [
        ProductSearchDialogComponent,
    ],
    entryComponents: [
        ProductSearchDialogComponent,
    ],
    exports: [
        ProductSearchDialogComponent,
    ],
})
export class ProductSearchDialogModule {
}
