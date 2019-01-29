import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatPaginator } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { first, get } from 'lodash';

import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { PURCHASE_ORDER_TYPE } from '@shared/enums';
import { PurchaseOrderService } from '@shared/services/purchase-order.service';
import { PurchaseOrder } from '@shared/models';
import { ConfirmDialogComponent } from '@shared/components';
import { PurchaseOrderSearchDialogComponent } from '@app/main/warehouse/purchase-order-search-dialog';
import { WarehouseImportDataSource } from '../warehouse-import.data-source';
import { WarehouseImportService } from '../warehouse-import.service';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { AuthenticationService } from '@shared/modules/authentication';
import { User } from '@shared/models';



@Component({
    selector: 'app-warehouse-import',
    templateUrl: './warehouse-import.component.html',
    styleUrls: ['./warehouse-import.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        WarehouseImportService,
    ],
})
export class WarehouseImportComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private paginator: MatPaginator;

    public dataSource: WarehouseImportDataSource;
    public dataSource2: WarehouseImportDataSource;
    public loggedInUser: User;


    public displayedColumns: string[] = [
        'id',
        'location',
        'areas',
        'managerDepartment',
        'subtotal',
        'status',
        'inputDate',
        'outputDate',
        'actions',
    ];
    public displayedColumns2: string[] = [
        'id',
        'location',
        'areas',
        'managerDepartment',
        'subtotal',
        'status',
    ];

    public searchInput: FormControl;

    public viewOrderType: PURCHASE_ORDER_TYPE;

    public viewPath: string;

    public readonly PURCHASE_ORDER_TYPE = PURCHASE_ORDER_TYPE;

    private unsubscribe$: Subject<any>;
    private unsubscribeAll: Subject<any>;


    constructor(
        private route: ActivatedRoute,
        private matDialog: MatDialog,
        private translate: TranslateService,
        private purchaseOrderService: PurchaseOrderService,
        private warehouseImportService: WarehouseImportService,
        private fuseProgressBarService: FuseProgressBarService,
        private notifier: NotifierService,
        private auth: AuthenticationService,

    ) {
        this.searchInput = new FormControl('');

        this.unsubscribe$ = new Subject();
        this.unsubscribeAll = new Subject<any>();

    }

    ngOnInit(): void {
        this.auth.user
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.loggedInUser = user;
            });
            console.log(this.loggedInUser.isRepairRole)
        this.route.parent.url
            .pipe(
                map((urlSegments: UrlSegment[]) => get(first(urlSegments), 'path', 'import')),
                takeUntil(this.unsubscribe$),
            )
            .subscribe((path: string) => {

                if (path === 'import') {
                    this.displayedColumns = this.displayedColumns.filter(c => c !== 'outputDate');
                    this.viewOrderType = PURCHASE_ORDER_TYPE.IN;
                } if (path === 'export') {
                    this.displayedColumns = this.displayedColumns.filter(c => c !== 'inputDate');
                    this.viewOrderType = PURCHASE_ORDER_TYPE.OUT;
                }

                this.viewPath = path;

                this._init();
            });
            this.purchaseOrderService.find({status:'pending'}).subscribe((response: any)=>{
                    this.dataSource2 = response.items;
                    console.log(this.dataSource2);
                });

        this.warehouseImportService
            .loading$
            .pipe(
                takeUntil(this.unsubscribe$),
            )
            .subscribe((visible: boolean) => {
                if (visible) {
                    this.fuseProgressBarService.show();
                } else {
                    this.fuseProgressBarService.hide();
                }
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this.unsubscribe$),
                debounceTime(300),
                distinctUntilChanged(),
            )
            .subscribe((keyword: string) => {
                // this.paginator.pageIndex = 0;
                this.warehouseImportService.term = {keyword};
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    private _init(): void {

        this.dataSource = new WarehouseImportDataSource(
            this.purchaseOrderService,
            this.warehouseImportService,
            // this.paginator,
            this.viewOrderType,
        );
        

    }

    get isImportOrderType(): boolean {
        return this.viewOrderType === PURCHASE_ORDER_TYPE.IN;
    }

    get isExportOrderType(): boolean {
        return this.viewOrderType === PURCHASE_ORDER_TYPE.OUT;
    }

    /*new(): void {
        const matDialogRef = this.matDialog.open(WarehouseImportFormComponent, {
            panelClass: 'warehouse-import-form-dialog',
            data: {
                action: 'new',
            },
            disableClose: true,
        });

        matDialogRef.afterClosed().subscribe((data) => {
            if (!data) {
                return;
            }

            this.notifier.show({
                type: 'success',
                message: this.translate.instant('WAREHOUSE_IMPORT.MESSAGES.CREATED'),
            });

            this.warehouseImportService.refresh();
        });
    }*/

    /*edit(purchaseOrder: PurchaseOrder): void {
        const matDialogRef = this.matDialog.open(WarehouseImportFormComponent, {
            panelClass: 'warehouse-import-form-dialog',
            data: {
                action: 'edit',
                purchaseOrder,
            },
            disableClose: true,
        });

        matDialogRef.afterClosed().subscribe((data) => {
            if (!data) {
                return;
            }

            this.notifier.show({
                type: 'success',
                message: this.translate.instant('WAREHOUSE_IMPORT.MESSAGES.UPDATED'),
            });

            this.warehouseImportService.refresh();
        });
    }*/

    remove(purchaseOrder: PurchaseOrder): void {
        const confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {

        });

        confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('PURCHASE_ORDER.MESSAGES.CONFIRM_DELETE');

        confirmDialogRef.afterClosed()
            .pipe(
                switchMap((response: any) => {
                    if (!response) {
                        return EMPTY;
                    }

                    this.warehouseImportService.loading = true;

                    return this.purchaseOrderService.remove(purchaseOrder);
                }),
            )
            .subscribe(() => {
                this.notifier.show({
                    type: 'success',
                    message: this.translate.instant('PURCHASE_ORDER.MESSAGES.DELETED'),
                });

                this.warehouseImportService.loading = false;

                this.warehouseImportService.refresh();
            });
    }

    show(purchaseOrder: PurchaseOrder): void {
        /*this.matDialog.open(WarehouseImportDetailComponent, {
            panelClass: 'warehouse-import-detail-dialog',
            data: {
                purchaseOrder,
            },
        });*/
    }

    openSearchDialog(): void {
        const searchDialogRef = this.matDialog.open(PurchaseOrderSearchDialogComponent, {
            panelClass: 'purchase-order-search-dialog',
            data: {
                term: this.warehouseImportService.term,
            },
        });

        searchDialogRef.afterClosed().subscribe((term: any) => {
            if (!term) {
                return;
            }

            if (Array.isArray(term) && term[0] === 'save') {
                // this.paginator.pageIndex = 0;
                this.warehouseImportService.term = term[1];
            }
        });
    }
}
