import { assign } from 'lodash';

export class Product {
    id: string;
    code: string;
    name: string;
    description: string;
    machinePart: string;
    manufacturer: string;

    constructor(props: any = {}) {
        assign(this, props);
    }

    static parse(props: any = {}): Product {
        return new Product(props);
    }
}
