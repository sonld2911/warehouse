import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { get, omit } from 'lodash';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

import { User, Warehouse } from '@shared/models';
import { ROLE } from '@shared/enums';
import { UserService } from '@shared/services/user.service';
import { WarehouseService } from '@shared/services/warehouse.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent implements OnInit {

    public form: FormGroup;
    public action: string;
    public user: User;
    public warehouses: Warehouse[];

    public readonly ROLE: any[];

    public loading: boolean;

    constructor(
        public matDialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private warehouseService: WarehouseService,
        private progressBarService: FuseProgressBarService,
    ) {
        this.action = get(data, 'action', 'new');

        if (this.action === 'edit') {
            this.user = get(data, 'user');
        } else {
            this.user = new User({});
        }

        this.ROLE = Object.keys(ROLE).map((key: string) => {
            return {
                id: ROLE[key],
                translateKey: key,
            };
        });

        this.loading = false;
    }

    ngOnInit() {
        this.form = this.initForm();

        // FIXME: query get all warehouses without paginate
        this.warehouseService
            .find({
                pageSize: 10000,
                pageIndex: 1,
            })
            .subscribe((response: any) => {
                this.warehouses = response.items;
            })
    }

    initForm(): FormGroup {
        return this.formBuilder.group({
            id: [{value: this.user.id, disabled: true}],
            username: [this.user.username],
            name: [this.user.name],
            password: ['', [Validators.minLength(6)]],
            role: [this.user.role],
            email: [this.user.email, [Validators.email]],
            warehouseId: [get(this.user, 'warehouse.id', ''), []],
        });
    }

    save(): void {
        const formValue = this.form.getRawValue();

        let data = {
            username: get(formValue, 'username'),
            email: get(formValue, 'email'),
            password: get(formValue, 'password'),
            name: get(formValue, 'name'),
            role: get(formValue, 'role'),
            warehouseId: get(formValue, 'warehouseId'),
        };

        if (data.password === '') {
            data = omit(data, 'password');
        }

        this.progressBarService.show();
        this.loading = true;
        this.form.disable({emitEvent: false});

        let stream$: Observable<any>;

        if (this.action === 'new') {
            stream$ = this.userService.create(data);
        } else {
            stream$ = this.userService.update(this.user.id, data);
        }

        // TODO: handle error from backend response
        stream$
            .pipe(
                finalize(() => {
                    this.progressBarService.hide();
                    this.loading = false;
                    this.form.enable({emitEvent: false});
                })
            )
            .subscribe((user: User) => {
                this.matDialogRef.close(user);
            });
    }

}
