import { Injectable } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { get } from 'lodash';
import { Warehouse } from '@shared/models';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {

    constructor(
        private api: ApiService,
        private http: HttpClient,
    ) {

    }

    find(term: any = {}): Observable<any> {
        const url = `${this.api.baseUrl}/warehouses`;

        const pageSize = get(term, 'pageSize', '10');

        const pageIndex = get(term, 'pageIndex', '1');

        const options = {
            params: new HttpParams()
                .set('limit', pageSize)
                .set('page', pageIndex),
        };

        return this.http.get(url, options)
            .pipe(
                map((response: any) => {
                    return {
                        count: response.count,
                        items: response.items.map((warehouse: any) => new Warehouse(warehouse)),
                    };
                }),
            );
    }

    findOne(id: string): Observable<Warehouse> {
        const url = `${this.api.baseUrl}/warehouses/${id}`;

        return this.http.get(url)
            .pipe(
                map((warehouse: any) => new Warehouse(warehouse)),
            );
    }

    create(props: any): Observable<Warehouse> {
        const url = `${this.api.baseUrl}/warehouses`;

        return this.http.post(url, props)
            .pipe(
                map((warehouse: any) => new Warehouse(warehouse)),
            );
    }

    update(id: string, props: any): Observable<Warehouse> {
        const url = `${this.api.baseUrl}/warehouses/${id}`;

        return this.http.patch(url, props)
            .pipe(
                map((warehouse: any) => new Warehouse(warehouse)),
            );
    }

    delete(id: string): Observable<any> {
        const url = `${this.api.baseUrl}/warehouses/${id}`;

        return this.http.delete(url);
    }
}
