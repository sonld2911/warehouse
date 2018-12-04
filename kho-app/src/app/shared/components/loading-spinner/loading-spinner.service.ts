import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingSpinnerService {

    private _visible: BehaviorSubject<boolean>;

    constructor() {
        this._visible = new BehaviorSubject<boolean>(false);
    }

    get visible(): Observable<boolean> {
        return this._visible.asObservable();
    }

    public show(): void {
        this._visible.next(true);
    }

    public hide(): void {
        this._visible.next(false);
    }
}
