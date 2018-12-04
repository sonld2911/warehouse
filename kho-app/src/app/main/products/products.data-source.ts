import { DataSource } from '@angular/cdk/table';
import { Product } from '@shared/models';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';

import { ProductService } from '@shared/services/product.service';
import { ProductsStoreService } from './products-store.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';

export class ProductsDataSource extends DataSource<any> {

    private data$: BehaviorSubject<Product[]>;

    public total: number;

    private unsubscribe$: Subject<any>;

    constructor(
        private productService: ProductService,
        private store$: ProductsStoreService,
        private paginator: MatPaginator,
    ) {
        super();

        this.data$ = new BehaviorSubject<Product[]>([]);

        this.total = 0;

        this.unsubscribe$ = new Subject<any>();
    }

    connect(): Observable<any> {
        merge(
            this.store$.term$,
            this.store$.refresh$,
            this.paginator.page,
        )
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
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
        const term = {
            ...this.store$.term,
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
        };

        this.store$.loading = true;

        this.productService
            .find(term)
            .pipe(
                finalize(() => {
                    this.store$.loading = false;
                }),
            )
            .subscribe((response: any) => {
                this.data$.next(response.items);
                this.total = response.count;
            });
    }
}
