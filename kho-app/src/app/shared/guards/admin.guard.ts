import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@shared/modules/authentication';
import { map } from 'rxjs/operators';
import { User } from '@shared/models';
import { ROLE } from '@shared/enums';
import { get } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {

    constructor(
        private auth: AuthenticationService,
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {

        return true;

        // return this.auth.user
        //     .pipe(
        //         map((user: User) => {
        //             return get(user, 'isAdminRole', false);
        //         }),
        //     );
    }
}
