import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '@shared/modules/authentication';
import { Subject } from 'rxjs';
import { User, Product } from '@shared/models';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ChangeProfileFormComponent } from '@app/main/dashboard/change-profile-form/change-profile-form.component';
import { ProductService } from '@app/shared/services/product.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: fuseAnimations,
})
export class DashboardComponent implements OnInit, OnDestroy {

    private unsubscribeAll: Subject<any>;

    public user: User;
    public product: Product;
    public displayedColumns: string[] = [
        'id',
        'code',
        'name',
        'manufacturer',
        'machinePart',
        'description',
        'guarantee',
        'new',
        'recovery',
    ];
    public count;
    public sumIn;
    public sumOut;
    constructor(
        private auth: AuthenticationService,
        private productService: ProductService,
        private matDialog: MatDialog,
    ) {
        this.unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        this.auth.user
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
        this.productService.find({}).subscribe((response: any) => {
            this.product = response.items;
        });
        this.productService.count().subscribe((response: any) => {
            this.count = response;
            this.sumIn = this.count.in.pending + this.count.in.accepted + this.count.in.rejected ;
            this.sumOut = this.count.out.pending + this.count.out.accepted + this.count.out.rejected ;
            console.log(this.count);
            console.log(this.sumIn);
            console.log(this.sumOut);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    showChangeProfileForm(): void {
        const dialog = this.matDialog.open(ChangeProfileFormComponent, {
            panelClass: 'change-profile-form-dialog',
            data: {
                user: this.user,
            },
        });

        dialog.afterClosed().subscribe((data: any) => {
            if (!data) {
                return;
            }

            if (data instanceof User) {
                this.auth.user = data;
            }
        });
    }

}
