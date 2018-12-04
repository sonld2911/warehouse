import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { ProductService } from '@shared/services/product.service';
import { Product, PurchaseOrderProduct } from '@shared/models';

import { ProductStoreService } from '../product-store.service';

@Component({
    selector: 'app-product-search-dialog',
    templateUrl: './product-search-dialog.component.html',
    styleUrls: ['./product-search-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProductSearchDialogComponent implements OnInit, OnDestroy {

    public searchInput: FormControl;

    private unsubscribe$: Subject<any>;

    public products: Product[];

    constructor(
        private formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<ProductSearchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private productService: ProductService,
        private store$: ProductStoreService,
    ) {
        this.searchInput = new FormControl('');

        this.unsubscribe$ = new Subject<any>();

        this.products = [];
    }

    ngOnInit(): void {
        this.searchInput.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((keyword: string) => {
                    const term = { keyword };

                    return this.productService.find(term);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(
                (response: any) => {
                    this.products = response.items;
                },
            );
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    select(product: Product): void {
        this.store$.products = PurchaseOrderProduct.parse({product});
        this.store$.selectProduct = PurchaseOrderProduct.parse({product});
    }

}
