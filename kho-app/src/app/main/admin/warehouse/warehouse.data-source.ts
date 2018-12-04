import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { WarehouseService } from '@shared/services/warehouse.service';
import { LoadingSpinnerService } from '@shared/components/loading-spinner/loading-spinner.service';
import { Warehouse } from '@shared/models';
import { finalize } from 'rxjs/operators';

export class WarehouseDataSource extends DataSource<any> {

    private data$: BehaviorSubject<any>;

    public count: number;

    public term: any = {};

    constructor(
        private warehouseService: WarehouseService,
        private spinner: LoadingSpinnerService,
    ) {
        super();

        this.data$ = new BehaviorSubject<any>([]);

        this.count = 0;
    }

    connect(): Observable<any> {
        return this.data$.asObservable();
    }

    disconnect(): void {
        this.data$.complete();
    }

    set page(value) {
        this.term = {...this.term, ...value};
        this.load();
    }

    load(): void {

        this.spinner.show();
        this.warehouseService
            .find(this.term)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                }),
            )
            .subscribe((response: any) => {
                this.data$.next(response.items);
                this.count = response.count;
            });

    }
}
