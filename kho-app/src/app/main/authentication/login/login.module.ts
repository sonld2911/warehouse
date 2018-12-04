import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
} from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
    {
        path: 'auth/login',
        component: LoginComponent,
    },
];

@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [
        FuseSharedModule,
        TranslateModule,

        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
    ],
})
export class LoginModule {
}
