import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { get } from 'lodash';

import { ApiService } from '@shared/services/api.service';
import { Product } from '@shared/models';

@Injectable({
    providedIn: 'root',
})
export class ProductService {

    private readonly BASE_URL = `${this.api.baseUrl}/products`;

    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) {
    }

    find(term: any = {}): Observable<any> {

        const pageSize = get(term, 'pageSize', '10');

        const pageIndex = get(term, 'pageIndex', '0');

        const query: any = {};

        if (term.hasOwnProperty('keyword')) {
            const queryKeyword = [];

            ['code', 'name', 'manufacturer'].forEach((field: string) => {
                queryKeyword.push({
                    [field]: {
                        '$regex': term.keyword,
                        '$options': 'i',
                    },
                });
            });

            query['$or'] = queryKeyword;
        }

        const sort: any = {};

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

        return this.http.get(this.BASE_URL, options)
            .pipe(
                map((response: any) => {
                    return {
                        count: response.count,
                        items: response.items.map((product: any) => Product.parse(product)),
                    };
                }),
            );
    }

    findOne(id: string, term: any = {}): Observable<Product> {
        return this.http.get(`${this.BASE_URL}/${id}`)
            .pipe(
                map((response: any) => Product.parse(response)),
            );
    }

    create(product: Product): Observable<Product> {
        return this.http.post(this.BASE_URL, product)
            .pipe(
                map((response: any) => Product.parse(response)),
            );
    }

    update(product: Product): Observable<Product> {
        return this.http.patch(`${this.BASE_URL}/${product.id}`, product)
            .pipe(
                map((response: any) => Product.parse(response)),
            );
    }

    remove(product: Product): Observable<any> {
        return this.http.delete(`${this.BASE_URL}/${product.id}`);
    }
}
