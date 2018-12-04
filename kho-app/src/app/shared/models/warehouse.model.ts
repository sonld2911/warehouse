import { assign } from 'lodash';

export class Warehouse {
    id: string;
    name: string;

    constructor(props: any = {}) {
        assign(this, props);
    }
}
