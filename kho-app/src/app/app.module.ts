import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MAT_DATE_LOCALE } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';
import { ProtectedGuard } from 'ngx-auth';
import { NotifierModule } from 'angular-notifier';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { AuthenticationModule } from '@shared/modules';
import { LoginModule } from '@app/main/authentication';
import { DashboardModule, DashboardComponent } from '@app/main/dashboard';
import { AdminGuard } from '@shared/guards/admin.guard';

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [ProtectedGuard],
    },
    {
        path: 'admin/users',
        loadChildren: './main/admin/user/user.module#UserModule',
        canActivate: [ProtectedGuard, AdminGuard],
    },
    {
        path: 'admin/warehouses',
        loadChildren: './main/admin/warehouse/warehouse.module#WarehouseModule',
        canActivate: [ProtectedGuard, AdminGuard],
    },
    {
        path: 'warehouse',
        loadChildren: './main/warehouse/warehouse.module#WarehouseModule',
    },
    {
        path: 'products',
        loadChildren: './main/products/products.module#ProductsModule',
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        NotifierModule.withConfig({
            position: {
                horizontal: {
                    position: 'middle',
                },
            },
        }),

        AuthenticationModule,
        LoginModule,
        DashboardModule,
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'vi',
        },
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'vi-VN',
        },
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
