import { Injectable } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@shared/models/user.model';
import { toNumber, get } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
    ) {
    }

    me(): Observable<User> {
        const url = `${this.api.baseUrl}/me`;

        return this.http.get(url)
            .pipe(
                map((response: any) => new User(response)),
            );
    }

    changeProfile(data: object): Observable<User> {
        const url = `${this.api.baseUrl}/me`;

        return this.http.patch(url, data)
            .pipe(
                map((response: any) => new User(response)),
            );
    }

    find(term: any = {}): Observable<any> {
        const url = `${this.api.baseUrl}/users`;

        const pageSize = get(term, 'pageSize', '10');

        const pageIndex = get(term, 'pageIndex', '0');

        const filter = {'populate': 'warehouseId'};

        const options = {
            params: new HttpParams()
                .set('limit', pageSize)
                .set('page', `${+pageIndex + 1}`)
                .set('filter', JSON.stringify(filter)),
        };

        return this.http.get(url, options)
            .pipe(
                map((response: any) => {
                    return {
                        count: response.count,
                        items: response.items.map((user: any) => new User(user)),
                    };
                }),
            );
    }

    count(term: any = {}): Observable<number> {
        const url = `${this.api.baseUrl}/users/count`;

        return this.http.get(url)
            .pipe(
                map((response: any) => toNumber(get(response, 'count', 0))),
            );
    }

    findOne(id: string): Observable<User> {
        const url = `${this.api.baseUrl}/users/${id}`;

        return this.http.get(url)
            .pipe(
                map((response: any) => new User(response)),
            );
    }

    create(data: any): Observable<User> {
        const url = `${this.api.baseUrl}/users`;

        return this.http.post(url, data)
            .pipe(
                map((response: any) => new User(response)),
            );
    }

    update(id: string, data: any): Observable<User> {
        const url = `${this.api.baseUrl}/users/${id}`;

        return this.http.patch(url, data)
            .pipe(
                map((response: any) => new User(response)),
            );
    }

    delete(id: string): Observable<any> {
        const url = `${this.api.baseUrl}/users/${id}`;

        return this.http.delete(url);
    }
}
