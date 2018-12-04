import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { LoadingSpinnerService } from './loading-spinner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {

    public visible: boolean;

    private unsubscribeAll: Subject<any>;

    constructor(
        private spinner: LoadingSpinnerService,
    ) {
        this.unsubscribeAll = new Subject<any>();
        this.visible = false;
    }

    @HostBinding('class.is-visible') get isVisible(): boolean {
        return this.visible;
    }

    ngOnInit(): void {
        this.spinner.visible
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((visible: boolean) => {
                this.visible = visible;
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

}
