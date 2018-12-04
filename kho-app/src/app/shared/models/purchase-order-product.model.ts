import { assign, forEach, get, omitBy, isNil } from 'lodash';

import { Product } from '@shared/models';
import { PRODUCT_TYPE } from '@shared/enums';

export class PurchaseOrderProduct {
    id: string;
    price: number;
    quantity: number;
    productType: string;
    amount: number;
    product: Product | any;
    productId?: string;

    constructor(props: any = {}) {
        if (props.hasOwnProperty('product') && typeof props.product !== 'string') {
            props.product = new Product(props.product);
        }

        assign(this, props);
    }

    get isProductTypeNew(): boolean {
        return this.productType === PRODUCT_TYPE.NEW;
    }

    get isProductTypeRecovery(): boolean {
        return this.productType === PRODUCT_TYPE.RECOVERY;
    }

    get isProductTypeGuarantee(): boolean {
        return this.productType === PRODUCT_TYPE.GUARANTEE;
    }

    static parse(props: any = {}): PurchaseOrderProduct {
        /*const attributes = PurchaseOrderProduct.attributeMap();

        const data: any = {};

        forEach(attributes, (value: string, key: string) => {
            data[key] = get(props, [value]);
        });

        if (data.hasOwnProperty('product')) {
            data.product = Product.parse(data.product);
        }
*/
        return new PurchaseOrderProduct(props);
    }

    /*static attributeMap(): any {
        return {
            id: 'id',
            price: 'price',
            quantity: 'quantity',
            productType: 'product_type',
            amount: 'amount',
            product: 'product',
        };
    };
*/
   /* toJSON(): any {
        const attributes = PurchaseOrderProduct.attributeMap();

        const data = {};

        forEach(attributes, (value: string, key: string) => {
            data[value] = this[key];
        });

        // remove null or undefined value
        return omitBy(data, isNil);
    }*/
}
