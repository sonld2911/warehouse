import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
} from '@angular/material';
import { LoadingSpinnerModule } from '@shared/components';
import { ChangeProfileFormComponent } from './change-profile-form/change-profile-form.component';

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,

        LoadingSpinnerModule,

        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    declarations: [
        DashboardComponent,
        ChangeProfileFormComponent,
    ],
    entryComponents: [
        ChangeProfileFormComponent,
    ],
})
export class DashboardModule {
}
