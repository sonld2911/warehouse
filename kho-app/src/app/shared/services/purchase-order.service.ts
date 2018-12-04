import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { get } from 'lodash';

import { ApiService } from '@shared/services/api.service';
import { PurchaseOrder } from '@shared/models';


@Injectable({
    providedIn: 'root',
})
export class PurchaseOrderService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
    ) {
    }

    find(term: any = {}): Observable<any> {
        const url = `${this.api.baseUrl}/purchase-orders`;

        const pageSize = get(term, 'pageSize', '10');

        const pageIndex = get(term, 'pageIndex', '0');

        const query: any = {};

        const sort: any = {};

        // FILTER
        if (term.hasOwnProperty('keyword')) {
            const queryKeyword = [];

            [
                'name',
                'areas',
                'location',
                'manufacturer',
                'managerDepartment',
                'machinePart',
            ].forEach((field: string) => {
                queryKeyword.push({
                    [field]: {
                        '$regex': term.keyword,
                        '$options': 'i',
                    },
                });
            });

            query['$or'] = queryKeyword;
        }
/*
        if (term.hasOwnProperty('code')) {
            query.code = term.code;
        }*/

        /*if (term.hasOwnProperty('productType')) {
            query.productType = term.productType;
        }*/

        if (term.hasOwnProperty('status')) {
            query.status = term.status;
        }

        if (term.hasOwnProperty('orderType')) {
            query.orderType = term.orderType;
        }

        if (term.hasOwnProperty('warehousingDates')) {
            query.warehousingDate = {
                '$gte': term.warehousingDates.startDate,
                '$lte': term.warehousingDates.endDate,
            };
        }

        // SORT
        if (term.hasOwnProperty('sort')) {
            // TODO: ....
        } else {
            sort.createdAt = -1;
        }

        const options = {
            params: new HttpParams()
                .set('limit', pageSize)
                .set('page', `${+pageIndex + 1}`)
                .set('query', JSON.stringify(query))
                .set('sort', JSON.stringify(sort)),
        };

        return this.http.get(url, options)
            .pipe(
                map((response: any) => {
                    return {
                        count: response.count,
                        items: response.items.map((item: any) => PurchaseOrder.parse(item)),
                    };
                }),
            );
    }

    findOne(id: string): Observable<any> {
        return this.http.get(`${this.api.baseUrl}/purchase-orders/${id}`)
            .pipe(
                map(response => PurchaseOrder.parse(response)),
            );
    }

    /*create(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder> {
        const url = `${this.api.baseUrl}/purchase-orders`;

        return this.http.post(url, purchaseOrder)
            .pipe(
                map((response: any) => new PurchaseOrder(response)),
            );
    }*/

    create(data: any): Observable<PurchaseOrder> {
        const url = `${this.api.baseUrl}/purchase-orders`;

        return this.http.post(url, data)
            .pipe(
                map((response: any) => new PurchaseOrder(response)),
            );
    }

    update(data: any): Observable<PurchaseOrder> {
        const url = `${this.api.baseUrl}/purchase-orders/${data.id}`;

        return this.http.patch(url, data)
            .pipe(
                map((response: any) => new PurchaseOrder(response)),
            );
    }

    // update(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder> {
    //     if (!purchaseOrder.id) {
    //         // TODO: handle error
    //     }
    //
    //     const url = `${this.api.baseUrl}/purchase-orders/${purchaseOrder.id}`;
    //
    //     return this.http.patch(url, purchaseOrder)
    //         .pipe(
    //             map((response: any) => new PurchaseOrder(response)),
    //         );
    // }

    remove(purchaseOrder: PurchaseOrder): Observable<any> {
        if (!purchaseOrder.id) {
            // TODO: handle error
        }

        const url = `${this.api.baseUrl}/purchase-orders/${purchaseOrder.id}`;

        return this.http.delete(url);
    }
}
