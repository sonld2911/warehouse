import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { pick } from 'lodash';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerService } from '@shared/components/loading-spinner/loading-spinner.service';
import { Subject } from 'rxjs';
import { ConfirmedPasswordValidator } from '@shared/validators';

@Component({
    selector: 'app-change-profile-form',
    templateUrl: './change-profile-form.component.html',
    styleUrls: ['./change-profile-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ChangeProfileFormComponent implements OnInit, OnDestroy {

    public user: User;

    public form: FormGroup;

    public saving: boolean;

    private unsubscribeAll: Subject<any>;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        public matDialogRef: MatDialogRef<ChangeProfileFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private spinner: LoadingSpinnerService,
    ) {
        this.user = this.data.user;

        this.form = this.formBuilder.group({
            name: [this.user.name],
            email: [this.user.email, [Validators.email]],
            password: ['', [Validators.minLength(6)]],
            passwordConfirmation: [''],
        }, {
            validator: ConfirmedPasswordValidator(),
        });

        this.saving = false;

        this.unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    save(): void {
        const formValue = this.form.getRawValue();

        this.saving = true;
        this.spinner.show();
        this.form.disable({emitEvent: false});
        this.userService.changeProfile(formValue)
            .pipe(
                finalize(() => {
                    this.saving = false;
                    this.spinner.hide();
                    this.form.enable({emitEvent: false});
                }),
            )
            .subscribe(
                (user: User) => {
                    this.matDialogRef.close(user);
                },
                (err: any) => {
                    // TODO: handle error
                },
            );
    }

}
