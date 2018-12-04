import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { AuthenticationService } from '@shared/modules/authentication';
import { ConfirmDialogComponent } from '@shared/components';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models';

import { UserDataSource } from '../user.data-source';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'users-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    animations: fuseAnimations,
})
export class UserListComponent implements OnInit, OnDestroy {

    @Input() public dataSource: UserDataSource;

    public loggedInUser: User;

    public displayedColumns: string[] = [
        'id',
        'name',
        'role',
        'warehouse',
        'joinedAt',
        'actions',
    ];

    private unsubscribeAll: Subject<any>;

    constructor(
        private matDialog: MatDialog,
        private translate: TranslateService,
        private userService: UserService,
        private fuseProgressBarService: FuseProgressBarService,
        private auth: AuthenticationService,
    ) {
        this.unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
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

    onPageChanges(page: any): void {
        this.dataSource.page = page;
    }

    edit(user: User): void {
        const dialog = this.matDialog.open(UserFormComponent, {
            panelClass: 'user-form-dialog',
            data: {
                action: 'edit',
                user: user,
            },
        });

        dialog.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            this.dataSource.find();
        });
    }

    delete(user: User): void {
        const confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('USER.MESSAGES.CONFIRM_DELETE');

        confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.fuseProgressBarService.show();
                this.userService.delete(user.id)
                    .pipe(
                        finalize(() => {
                            this.fuseProgressBarService.hide();
                        }),
                    )
                    .subscribe(
                        () => {
                            this.dataSource.find();
                        }
                    );
            }
        });
    }

}
