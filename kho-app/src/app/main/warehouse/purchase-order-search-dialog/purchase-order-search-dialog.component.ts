import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { get, isEmpty } from 'lodash';
import * as moment from 'moment';

import { PURCHASE_ORDER_STATUS } from '@shared/enums';

@Component({
    selector: 'app-purchase-order-search-dialog',
    templateUrl: './purchase-order-search-dialog.component.html',
    styleUrls: ['./purchase-order-search-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PurchaseOrderSearchDialogComponent implements OnInit {

    public form: FormGroup;

    public term: any;

    public readonly PURCHASE_ORDER_STATUS: any;

    constructor(
        private formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<PurchaseOrderSearchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
    ) {
        this.term = {
            ...this.data.term
        };

        // parse warehousing date ranges
        if (this.term.warehousingDates) {
            const warehousingDates: any = {};

            const startDate = get(this.term, 'warehousingDates.startDate', '');
            const endDate = get(this.term, 'warehousingDates.endDate', '');

            if (startDate) {
                warehousingDates.startDate = moment.utc(startDate);
            }

            if (endDate) {
                warehousingDates.endDate = moment.utc(endDate);
            }

            if (!isEmpty(warehousingDates)) {
                this.term.warehousingDates = warehousingDates;
            }
        }

        this.PURCHASE_ORDER_STATUS = Object.keys(PURCHASE_ORDER_STATUS).map((id: string) => {
            return {
                id: PURCHASE_ORDER_STATUS[id],
                translateKey: `PURCHASE_ORDER.STATUSES.${id}`,
            };
        });
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            status: [get(this.term, 'status', '')],
            warehousingDates: [get(this.term, 'warehousingDates', '')],
        });
    }

    clear(): void {
        this.form.reset();
    }

    save(): void {
        const formValue = this.form.getRawValue();

        if (formValue.warehousingDates) {
            const startDate = formValue.warehousingDates.startDate.format('YYYY-MM-DD[T]00:00:00.000[Z]');
            const endDate = formValue.warehousingDates.endDate.format('YYYY-MM-DD[T]23:59:59.999[Z]');

            formValue.warehousingDates = {
                startDate,
                endDate,
            };
        }

        const term = {
            ...this.term,
            ...formValue,
        };

        this.matDialogRef.close(['save', term]);
    }

}
