import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator } from '@angular/material';
import { EMPTY, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';

import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { Product } from '@shared/models';
import { ConfirmDialogComponent } from '@shared/components';
import { ProductService } from '@shared/services/product.service';

import { ProductFormComponent } from './product-form/product-form.component';
import { ProductsDataSource } from './products.data-source';
import { ProductsStoreService } from './products-store.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProductsStoreService,
    ],
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {

    public searchInput: FormControl;

    public displayedColumns: string[] = [
        'id',
        'code',
        'name',
        'manufacturer',
        'actions',
    ];

    public dataSource: ProductsDataSource;

    @ViewChild(MatPaginator) private paginator: MatPaginator;

    private unsubscribe$: Subject<any>;

    constructor(
        private matDialog: MatDialog,
        private productService: ProductService,
        private translate: TranslateService,
        private notifier: NotifierService,
        private fuseProgressBarService: FuseProgressBarService,
        private store$: ProductsStoreService,
    ) {
        this.searchInput = new FormControl('');

        this.unsubscribe$ = new Subject<any>();
    }

    ngOnInit(): void {
        this.dataSource = new ProductsDataSource(
            this.productService,
            this.store$,
            this.paginator,
        );

        this.store$.loading$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((visible: boolean) => {
                if (visible) {
                    this.fuseProgressBarService.show();
                } else {
                    this.fuseProgressBarService.hide();
                }
            });

        this.searchInput.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this.unsubscribe$),
            )
            .subscribe((keyword: string) => {
                this.store$.term = { keyword };
            });
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    openCreateForm(): void {
        const createFormDialog = this.matDialog.open(ProductFormComponent, {
            panelClass: 'product-form-dialog',
            data: {
                action: 'new',
            },
        });

        createFormDialog.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            this.notifier.show({
                type: 'success',
                message: this.translate.instant('PRODUCTS.MESSAGES.CREATED'),
            });

            this.store$.refresh();
        });
    }

    openEditForm(product: Product): void {
        const editFormDialog = this.matDialog.open(ProductFormComponent, {
            panelClass: 'product-form-dialog',
            data: {
                action: 'edit',
                product,
            },
        });

        editFormDialog.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            this.notifier.show({
                type: 'success',
                message: this.translate.instant('PRODUCTS.MESSAGES.UPDATED'),
            });

            this.store$.refresh();
        });
    }

    openConfirmDeleteDialog(product: Product): void {
        const confirmDialogRef = this.matDialog.open(ConfirmDialogComponent);

        confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('PRODUCTS.MESSAGES.CONFIRM_DELETE');

        confirmDialogRef.afterClosed()
            .pipe(
                switchMap((response: any) => {
                    if (!response) {
                        return EMPTY;
                    }

                    this.store$.loading = true;

                    return this.productService.remove(product);
                }),
            )
            .subscribe(() => {
                this.notifier.show({
                    type: 'success',
                    message: this.translate.instant('PRODUCTS.MESSAGES.DELETED'),
                });

                this.store$.loading = false;

                this.store$.refresh();
            });
    }

}
