import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoadingSpinnerService } from '@shared/components/loading-spinner/loading-spinner.service';
import { AuthenticationService } from '@shared/modules/authentication';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models';

import { UserDataSource } from './user.data-source';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit, OnDestroy {

    public dataSource: UserDataSource;

    public loggedInUser: User;

    private unsubscribeAll: Subject<any>;

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private auth: AuthenticationService,
        private loadingSpinnerService: LoadingSpinnerService,
    ) {
        this.dataSource = new UserDataSource(userService, loadingSpinnerService);
        this.unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
       this.dataSource.find();

       this.auth.user
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.loggedInUser = user;
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    new(): void {
        const dialog = this.dialog.open(UserFormComponent, {
            panelClass: 'user-form-dialog',
            data: {
                action: 'new',
            },
        });

        dialog.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            this.dataSource.find();
        });
    }

}
