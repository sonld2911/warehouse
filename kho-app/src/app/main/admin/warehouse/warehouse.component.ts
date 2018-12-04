import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { LoadingSpinnerService } from '@shared/components/loading-spinner/loading-spinner.service';
import { WarehouseService } from '@shared/services/warehouse.service';

import { WarehouseDataSource } from './warehouse.data-source';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';


@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class WarehouseComponent implements OnInit {

    public dataSource: WarehouseDataSource;

    constructor(
        private matDialog: MatDialog,
        private spinner: LoadingSpinnerService,
        private warehouseService: WarehouseService,
    ) {
        this.dataSource = new WarehouseDataSource(
            this.warehouseService,
            spinner,
        );
    }

    ngOnInit() {
        this.dataSource.load();
    }

    new(): void {
        const createDialogRef = this.matDialog.open(WarehouseFormComponent, {
            panelClass: 'warehouse-form-dialog',
            data: {
                action: 'new',
            },
        });

        createDialogRef.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            this.dataSource.load();
        });
    }
}
