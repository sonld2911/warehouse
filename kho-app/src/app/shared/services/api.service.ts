import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { trimEnd } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    private readonly BASE_URL = trimEnd(environment.api.endPoint, '/');

    constructor() {
    }

    get baseUrl(): string {
        return this.BASE_URL;
    }
}
