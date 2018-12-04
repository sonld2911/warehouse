import { assign, get, invert } from 'lodash';
import { ROLE } from '@shared/enums';
import { Warehouse } from '@shared/models/warehouse.model';

const USER_ROLE: any = invert(ROLE);

export class User {
    id: string;
    username: string;
    name: string;
    email: string;
    password?: string;
    role: string;

    createdAt: Date;

    warehouse: Warehouse;

    constructor(props: any = {}) {
        assign(this, props);

        if (props.hasOwnProperty('warehouse')) {
            this.warehouse = new Warehouse(props.warehouse);
        }

        this.createdAt = get(props, 'created_at');
    }

    get joinedAt(): Date {
        return this.createdAt;
    }

    get roleKey(): string {
        return get(USER_ROLE, [this.role], null);
    }

    get isAdminRole(): boolean {
        return this.role === ROLE.ADMIN;
    }

    get isManagerRole(): boolean {
        return this.role === ROLE.MANAGER;
    }

    get isStockerRole(): boolean {
        return this.role === ROLE.STOCKER;
    }

    get isUserRole(): boolean {
        return this.role === ROLE.USER;
    }
}
