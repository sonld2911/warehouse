import { get } from 'lodash';

export class Token {
    accessToken: string;

    constructor(props: any = {}) {
        this.accessToken = get(props, 'access_token', '');
    }
}
