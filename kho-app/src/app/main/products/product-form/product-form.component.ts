import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { get, clone, assign } from 'lodash';

import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { Product } from '@shared/models';
import { ProductService } from '@shared/services/product.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProductFormComponent implements OnInit {

    public form: FormGroup;

    public action: string;

    public product: Product;

    public loading: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        public matDialogRef: MatDialogRef<ProductFormComponent>,
        private formBuilder: FormBuilder,
        private loadingBar: FuseProgressBarService,
        private productService: ProductService,
    ) {
        this.action = get(this.data, 'action', 'new');

        this.product = clone(get(this.data, 'product', new Product()));

        this.loading = false;
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            code: [get(this.product, 'code', '')],
            name: [get(this.product, 'name', '')],
            description: [get(this.product, 'description', '')],
            machinePart: [get(this.product, 'machinePart', '')],
            manufacturer: [get(this.product, 'manufacturer', '')],
        });
    }

    save(): void {
        if (this.form.invalid) {
            return;
        }

        const formValue = this.form.getRawValue();

        this.product = assign(this.product, formValue);

        this.form.disable({emitEvent: false});
        this.loading = true;
        this.loadingBar.show();

        let action$: Observable<any>;

        if (this.action === 'edit') {
            action$ = this.productService.update(this.product);
        } else {
            action$ = this.productService.create(this.product);
        }

        action$.pipe(
            finalize(() => {
                this.form.enable({ emitEvent: false });
                this.loading = false;
                this.loadingBar.hide();
            }),
        ).subscribe(
            (product: Product) => {
                this.matDialogRef.close(product);
            },
            () => {
                // TODO: handle error
            }
        );
    }
}
