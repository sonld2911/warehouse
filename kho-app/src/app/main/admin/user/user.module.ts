import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { AppConfirmDialogModule, LoadingSpinnerModule } from '@shared/components';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
    imports: [
        FuseSharedModule,
        TranslateModule,
        UserRoutingModule,
        AppConfirmDialogModule,
        LoadingSpinnerModule,

        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatSelectModule,
    ],
    declarations: [
        UserComponent,
        UserListComponent,
        UserFormComponent,
    ],
    entryComponents: [
        UserFormComponent,
    ],
})
export class UserModule {
}
