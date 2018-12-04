import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerService } from '@shared/components/loading-spinner/loading-spinner.service';

export class UserDataSource extends DataSource<any> {

    private dataSubject: BehaviorSubject<any>;

    public count: number;

    private term: any;

    constructor(
        private userService: UserService,
        private spinner: LoadingSpinnerService,
    ) {
        super();

        this.dataSubject = new BehaviorSubject<any>(null);

        this.count = 0;

        this.term = {};
    }

    connect(): Observable<any> {
        return this.dataSubject.asObservable();
    }

    disconnect(): void {
        this.dataSubject.next(null);
        this.dataSubject.complete();
    }

    find(): void {
        this.spinner.show();
        this.userService
            .find(this.term)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(({items, count}: {items: User[], count: number}) => {
                this.dataSubject.next(items);
                this.count = count;
            });
    }

    set page(value) {
        this.term = {...this.term, ...value};
        this.find();
    }
}
