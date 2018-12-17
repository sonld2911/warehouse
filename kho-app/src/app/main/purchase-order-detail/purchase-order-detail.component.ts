import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { concatMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, of, Subject } from 'rxjs';
import { first, get } from 'lodash';

import { PurchaseOrderService } from '@shared/services/purchase-order.service';
import { PurchaseOrder, User } from '@shared/models';
import { UserService } from '@shared/services/user.service';

@Component({
    selector: 'app-purchase-order-detail',
    templateUrl: './purchase-order-detail.component.html',
    styleUrls: ['./purchase-order-detail.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class PurchaseOrderDetailComponent implements OnInit, OnDestroy {

    public data$: Observable<any>;

    public viewPath: string;

    private unsubscribe$: Subject<any>;

    constructor(
        private route: ActivatedRoute,
        private purchaseOrderService: PurchaseOrderService,
        private userService: UserService,
    ) {
        this.unsubscribe$ = new Subject<any>();
    }

    ngOnInit(): void {
        this.route.parent.url
            .pipe(
                map((urlSegments: UrlSegment[]) => {
                    return get(first(urlSegments), 'path', 'import');
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe((path: string) => {
                this.viewPath = path;
            });


        this.data$ = this.route.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const id = params.get('id');

                    if (!id) {
                        return EMPTY;
                    }

                    return this.purchaseOrderService.findOne(id);
                }),
                concatMap((purchaseOrder: PurchaseOrder) => {

                    const stream$ = [];

                    stream$.push(of(purchaseOrder));

                    if (purchaseOrder.createdBy) {
                        stream$.push(this.userService.findOne(purchaseOrder.createdBy));
                    }

                    if (purchaseOrder.updatedBy) {
                        stream$.push(this.userService.findOne(purchaseOrder.updatedBy));
                    }

                    return forkJoin(stream$);
                }),
                map(([purchaseOrder, createdBy, updatedBy]) => ({
                    purchaseOrder,
                    createdBy,
                    updatedBy
                })),
                takeUntil(this.unsubscribe$),
            );
    }
    ssapprover(id , status): void {
        console.log(id);
        this.purchaseOrderService.invoiceApproval(id , status).subscribe(() => {

console.log('ok');
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
