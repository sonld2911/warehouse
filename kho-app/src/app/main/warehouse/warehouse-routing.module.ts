import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'import',
        loadChildren: './warehouse-import/warehouse-import.module#WarehouseImportModule',
    },
    {
        path: 'export',
        loadChildren: './warehouse-import/warehouse-import.module#WarehouseImportModule',
    },
    {
        path: 'approver',
        loadChildren: './warehouse-import/warehouse-import.module#WarehouseImportModule',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WarehouseRoutingModule {
}
