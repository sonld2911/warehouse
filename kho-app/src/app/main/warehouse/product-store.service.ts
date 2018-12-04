import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PurchaseOrderProduct } from '@shared/models';
import { pullAt } from 'lodash';

@Injectable()
export class ProductStoreService {

    private _products$: BehaviorSubject<any>;

    private _selectProduct$: Subject<any>;

    constructor() {
        this._products$ = new BehaviorSubject<any>([]);

        this._selectProduct$ = new Subject<any>();
    }

    get products$(): Observable<any> {
        return this._products$.asObservable();
    }

    get products(): any {
        return this._products$.value;
    }

    set products(product: any) {
        this._products$.next([
            ...this.products,
            product,
        ]);
    }

    get selectProduct$(): Observable<any> {
        return this._selectProduct$.asObservable();
    }

    set selectProduct(product: any) {
        this._selectProduct$.next(product);
    }

    removeAt(index: number) {
        const products = [...this.products];

        pullAt(products, index);

        this._products$.next(products);
    }
}
