import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class WarehouseImportService {

    private _loading$: BehaviorSubject<boolean>;

    private _term$: BehaviorSubject<any>;

    private _refresh$: Subject<any>;

    constructor() {
        this._loading$ = new BehaviorSubject<boolean>(true);

        this._term$ = new BehaviorSubject<any>({});

        this._refresh$ = new Subject<any>();
    }

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    set loading(value: boolean) {
        this._loading$.next(value);
    }

    get term$(): Observable<any> {
        return this._term$.asObservable();
    }

    get term(): any {
        return this._term$.value;
    }

    set term(value: any) {
        this._term$.next({
            ...this.term,
            ...value,
        });
    }

    get refresh$(): Observable<any> {
        return this._refresh$.asObservable();
    }

    refresh(): void {
        this._refresh$.next();
    }
}
