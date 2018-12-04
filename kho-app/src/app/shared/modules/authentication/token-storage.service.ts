import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TokenStorage {

    private readonly ACCESS_TOKEN_KEY = 'APP_ACCESS_TOKEN';

    public getAccessToken(): Observable<string> {
        const token: string = <string>localStorage.getItem(this.ACCESS_TOKEN_KEY);
        return of(token);
    }

    /*public getRefreshToken(): Observable<string> {
        const token: string = <string>localStorage.getItem('refreshToken');
        return of(token);
    }*/

    public setAccessToken(token: string): TokenStorage {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);

        return this;
    }

    /*public setRefreshToken(token: string): TokenStorage {
        localStorage.setItem('refreshToken', token);

        return this;
    }*/

    public clear(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        // localStorage.removeItem('refreshToken');
    }
}
