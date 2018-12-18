import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { isEmpty, omitBy } from 'lodash';

import { PurchaseOrderService } from '@shared/services/purchase-order.service';
import { WarehouseImportService } from './warehouse-import.service';
import { PURCHASE_ORDER_TYPE } from '@shared/enums';

export class WarehouseImportDataSource extends DataSource<any> {

    private data$: BehaviorSubject<any>;

    public count: number;

    private unsubscribe$: Subject<any>;

    constructor(
        private purchaseOrderService: PurchaseOrderService,
        private warehouseImportService: WarehouseImportService,
        // private paginator: MatPaginator,
        private orderType: PURCHASE_ORDER_TYPE,
    ) {
        super();

        this.data$ = new BehaviorSubject<any>([]);

        this.count = 0;

        this.unsubscribe$ = new Subject<any>();
    }

    connect(): Observable<any> {
        merge(
            // this.paginator.page,
            this.warehouseImportService.term$,
            this.warehouseImportService.refresh$,
        ).pipe(
            takeUntil(this.unsubscribe$),
        )
            .subscribe((a) => {
                this.search();
            });

        return this.data$.asObservable();
    }

    disconnect(): void {
        this.data$.complete();
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    search(): void {
        const term: any = {
            ...omitBy(this.warehouseImportService.term, isEmpty),
            // pageIndex: this.paginator.pageIndex,
            // pageSize: this.paginator.pageSize,
            orderType: this.orderType,
        };

        this.warehouseImportService.loading = true;

        this.purchaseOrderService.find(term)
            .pipe(
                finalize(() => {
                    this.warehouseImportService.loading = false;
                }),
            )
            .subscribe((response: any) => {
                this.data$.next(response.items);
                this.count = response.count;
            });
    }
}
