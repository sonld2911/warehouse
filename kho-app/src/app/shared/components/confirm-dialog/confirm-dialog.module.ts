import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    declarations: [
        ConfirmDialogComponent,
    ],
    imports: [
        TranslateModule,
        MatDialogModule,
        MatButtonModule,
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
})
export class AppConfirmDialogModule {
}
