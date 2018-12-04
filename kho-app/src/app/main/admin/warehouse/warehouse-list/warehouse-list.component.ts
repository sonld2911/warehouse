import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Warehouse } from '@shared/models';
import { ConfirmDialogComponent } from '@shared/components';
import { WarehouseService } from '@shared/services/warehouse.service';

import { WarehouseDataSource } from '../warehouse.data-source';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';

@Component({
    selector: 'app-warehouse-list',
    templateUrl: './warehouse-list.component.html',
    styleUrls: ['./warehouse-list.component.scss'],
    animations: fuseAnimations,
})
export class WarehouseListComponent implements OnInit {

    @Input() public dataSource: WarehouseDataSource;

    public displayedColumns: string[] = [
        'id',
        'name',
        'actions',
    ];

    constructor(
        private matDialog: MatDialog,
        private translate: TranslateService,
        private warehouseService: WarehouseService,
    ) {
    }

    ngOnInit() {
    }

    onPageChanges(page: any): void {
        this.dataSource.page = {
            ...page,
            pageIndex: ++page.pageIndex,
        };
    }

    edit(warehouse: Warehouse): void {
        const editDialogRef = this.matDialog.open(WarehouseFormComponent, {
            panelClass: 'warehouse-form-dialog',
            data: {
                action: 'edit',
                warehouse,
            },
        });

        editDialogRef.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            this.dataSource.load();
        });
    }

    delete(warehouse: Warehouse): void {
        const confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('WAREHOUSE.MESSAGES.CONFIRM_DELETE');

        confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) {
                return;
            }

            this.warehouseService
                .delete(warehouse.id)
                .pipe(
                    finalize(() => {

                    }),
                )
                .subscribe((warehouse: Warehouse) => {
                    this.dataSource.load();
                });
        });
    }

}
