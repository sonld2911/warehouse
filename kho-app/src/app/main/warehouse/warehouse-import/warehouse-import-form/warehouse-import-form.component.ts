import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';
import { ProductSearchDialogComponent } from '@app/main/warehouse/product-search-dialog/product-search-dialog.component';
import { ProductStoreService } from '../../product-store.service';
import { Product, PurchaseOrder, PurchaseOrderProduct } from '@shared/models';
import { EMPTY, Observable, Subject } from 'rxjs';
import { concatMap, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PRODUCT_TYPE, PURCHASE_ORDER_TYPE } from '@shared/enums';
import { PurchaseOrderService } from '@shared/services/purchase-order.service';
import { ActivatedRoute, ParamMap, Router, UrlSegment } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';

import { first, get } from 'lodash';

@Component({
    selector: 'app-warehouse-import-form',
    templateUrl: './warehouse-import-form.component.html',
    styleUrls: ['./warehouse-import-form.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class WarehouseImportFormComponent implements OnInit, OnDestroy {

    public form: FormGroup;

    // public products: Product[];

    public purchaseOrder: PurchaseOrder;

    public readonly PRODUCT_TYPES: any;

    public action: string;

    public viewPath: string;

    private unsubscribe$: Subject<any>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private matDialog: MatDialog,
        private purchaseOrderService: PurchaseOrderService,
        private productStore$: ProductStoreService,
        private notifier: NotifierService,
        private translate: TranslateService,
    ) {
        this.PRODUCT_TYPES = Object.keys(PRODUCT_TYPE).map((key: string) => {
            return {
                id: PRODUCT_TYPE[key],
                translateKey: key,
            };
        });

        this.action = 'new';

        this.purchaseOrder = new PurchaseOrder({products: []});

        this.form = this.formBuilder.group({
            id: [''],
            areas: [''],
            location: [''],
            managerDepartment: [''],
            inputDate: [''],
            outputDate: [''],
            // orderType: [PURCHASE_ORDER_TYPE.IN],
            products: this.formBuilder.array([]),
        });

        // this.products = [];

        this.unsubscribe$ = new Subject<any>();
    }

    ngOnInit(): void {

        this.route.parent.url
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((urlSegments: UrlSegment[]) => {

                this.viewPath = get(first(urlSegments), 'path', 'import');

            });

        const purchaseOrder$ = this.route.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const id = params.get('id');

                    if (!id) {
                        return EMPTY;
                    }

                    this.action = 'edit';

                    return this.purchaseOrderService.findOne(id);
                }),
                takeUntil(this.unsubscribe$),
            );

        purchaseOrder$.subscribe((purchaseOrder: PurchaseOrder) => {
            this.purchaseOrder = purchaseOrder;

            this.form.patchValue({
                id: purchaseOrder.id,
                areas: purchaseOrder.areas,
                location: purchaseOrder.location,
                managerDepartment: purchaseOrder.managerDepartment,
                inputDate: purchaseOrder.inputDate,
                outputDate: purchaseOrder.outputDate,
            });

            purchaseOrder.products.forEach((product: PurchaseOrderProduct) => {
                this.productStore$.selectProduct = product;
                this.productStore$.products = product;
            });
        });


        this.productStore$
            .products$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((products: PurchaseOrderProduct[]) => {
                this.purchaseOrder.products = [...products];
            });

        this.productStore$
            .selectProduct$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((purchaseOrderProduct: PurchaseOrderProduct) => {
                (this.form.get('products') as FormArray).push(
                    this.formBuilder.group({
                        product: [purchaseOrderProduct.product.id],
                        productType: [purchaseOrderProduct.productType],
                        price: [purchaseOrderProduct.price],
                        quantity: [purchaseOrderProduct.quantity],
                    }),
                );
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    removeProduct(index: number): void {
        (this.form.get('products') as FormArray).removeAt(index);
        this.productStore$.removeAt(index);

    }

    openSearchProductDialog(): void {
        this.matDialog.open(ProductSearchDialogComponent, {
            panelClass: 'product-search-dialog',
            data: {},
        });
    }

    save(): void {
        const formValue = this.form.getRawValue();

        if (this.viewPath === 'import') {
            formValue.orderType = PURCHASE_ORDER_TYPE.IN;
        } else {
            formValue.orderType = PURCHASE_ORDER_TYPE.OUT;
        }

        const purchaseOrder = new PurchaseOrder(formValue);

        let action$: Observable<any>;

        if (this.action === 'edit') {
            action$ = this.purchaseOrderService.update(purchaseOrder);
        } else {
            action$ = this.purchaseOrderService.create(purchaseOrder);
        }

        action$.subscribe(() => {
            const message = (this.action === 'edit') ?
                this.translate.instant('PURCHASE_ORDER.MESSAGES.EDITED') :
                this.translate.instant('PURCHASE_ORDER.MESSAGES.CREATED');

            this.notifier.show({
                type: 'success',
                message,
            });

            this.router.navigate([`/warehouse/${this.viewPath}`]);
        });
    }

}
