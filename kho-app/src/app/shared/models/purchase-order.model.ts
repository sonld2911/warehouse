import { get, forEach, assign, omitBy, isNil } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';

import { PURCHASE_ORDER_STATUS } from '@shared/enums';
import { PurchaseOrderProduct } from '@shared/models';

export class PurchaseOrder {
    id: string;
    areas: string;
    location: string;
    subtotal: number;
    managerDepartment: string;
    products: PurchaseOrderProduct[];
    inputDate: Date | null;
    outputDate: Date | null;
    orderType: string;
    status: string;
    warehouseId: string;

    createdBy: string | null;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: any = {}) {

        if (props.hasOwnProperty('products') && Array.isArray(props.products)) {
            props.products = props.products.map((product: any) => {
                return new PurchaseOrderProduct(product);
            });
        } else {
            props.products = [];
        }

        assign(this, props);

        /*if (props.hasOwnProperty('products') && Array.isArray(props.products)) {
            // data.products = data.products.map((product: any) => {
            //     return new PurchaseOrderProduct(product);
            // });

            this.products = props.products.map((product: any) => {
                if (!(product instanceof PurchaseOrderProduct)) {
                    return new PurchaseOrderProduct(product);
                }


                return product;
            });
        }*/
    }

    get isStatusPending(): boolean {
        return this.status === PURCHASE_ORDER_STATUS.PENDING;
    }

    get isStatusAccepted(): boolean {
        return this.status === PURCHASE_ORDER_STATUS.ACCEPTED;
    }

    get isStatusRejected(): boolean {
        return this.status === PURCHASE_ORDER_STATUS.REJECTED;
    }

    static parse(props: any = {}): PurchaseOrder {
        /*const attributes = PurchaseOrder.attributeMap();

        const data: any = {};

        forEach(attributes, (value: string, key: string) => {
            data[key] = get(props, [value]);
        });

        if (data.hasOwnProperty('products') && Array.isArray(data.products)) {
            data.products = data.products.map((product: any) => {
                return PurchaseOrderProduct.parse(product);
            });
        }

        const auditMetadata = {
            createdBy: 'created_by',
            updatedBy: 'updated_by',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        };

        forEach(auditMetadata, (value: string, key: string) => {
            if (props[value]) {
                data[key] = props[value];
            }
        });
*/
        return new PurchaseOrder(props);
    }

    /*static attributeMap(): any {
        return {
            id: 'id',
            areas: 'areas',
            location: 'location',
            subtotal: 'subtotal',
            managerDepartment: 'manager_department',
            products: 'products',
            inputDate: 'input_date',
            outputDate: 'output_date',
            orderType: 'order_type',
            status: 'status',
            warehouseId: 'warehouse_id',
        };
    }*/

    /*toJSON(): any {
        const data = this;



        /!*const attributes = PurchaseOrder.attributeMap();

        const data = {};

        forEach(attributes, (value: string, key: string) => {
            data[value] = this[key];
        });

        if (data.hasOwnProperty('input_date')) {
            if (data['input_date'] instanceof moment) {
                data['input_date'] = data['input_date'].format('YYYY-MM-DD[T]HH:mm:ss.SSSS[Z]');
            }
        }

        // remove null or undefined value
        return omitBy(data, isNil);*!/
    }*/
}
