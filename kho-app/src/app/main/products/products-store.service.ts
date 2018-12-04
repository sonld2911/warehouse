import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class ProductsStoreService {

    private _loading$: BehaviorSubject<boolean>;

    private _term$: BehaviorSubject<any>;

    private _refresh$: Subject<boolean>;

    constructor() {
        this._loading$ = new BehaviorSubject<boolean>(false);

        this._term$ = new BehaviorSubject<any>({});

        this._refresh$ = new Subject<boolean>();
    }

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    set loading(visible: boolean) {
        this._loading$.next(visible);
    }

    get term$(): Observable<any> {
        return this._term$.asObservable();
    }

    get term(): any {
        return this._term$.value;
    }

    set term(term: any) {
        this._term$.next({
            ...this.term,
            ...term,
        });
    }

    get refresh$(): Observable<boolean> {
        return this._refresh$.asObservable();
    }

    refresh(): void {
        this._refresh$.next(true);
    }
}
