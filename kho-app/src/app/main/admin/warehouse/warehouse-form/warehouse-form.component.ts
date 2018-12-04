import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { get } from 'lodash';

import { Warehouse } from '@shared/models';
import { WarehouseService } from '@shared/services/warehouse.service';

@Component({
    selector: 'app-warehouse-form',
    templateUrl: './warehouse-form.component.html',
    styleUrls: ['./warehouse-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WarehouseFormComponent implements OnInit {

    public form: FormGroup;

    public action: string;

    public warehouse: Warehouse;

    public loading: boolean;

    constructor(
        public matDialogRef: MatDialogRef<WarehouseFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private warehouseService: WarehouseService,
    ) {
        this.action = get(this.data, 'action', 'new');

        this.warehouse = get(this.data, 'warehouse', new Warehouse());

        this.loading = false;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            id: [{value: this.warehouse.id, disabled: true}],
            name: [this.warehouse.name],
        });
    }

    save(): void {
        const formValue = this.form.getRawValue();

        const data = {
            name: get(formValue, 'name'),
        };

        let stream$: Observable<Warehouse>;

        if (this.action === 'edit') {
            stream$ = this.warehouseService.update(this.warehouse.id, data);
        } else {
            stream$ = this.warehouseService.create(data);
        }

        this.loading = true;
        this.form.disable({emitEvent: false});
        stream$.pipe(
            finalize(() => {
                this.loading = false;
                this.form.enable({emitEvent: false});
            }),
        )
            .subscribe(
                (warehouse: Warehouse) => {
                    this.matDialogRef.close(warehouse);
                },
                (error: any) => {
                    // handle error
                },
            );
    }

}
