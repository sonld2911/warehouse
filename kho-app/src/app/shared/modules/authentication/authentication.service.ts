import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, switchMap, catchError, share } from 'rxjs/operators';
import { AuthService } from 'ngx-auth';
import { ApiService } from '@shared/services/api.service';
import { Token } from './token.model';
import { TokenStorage } from './token-storage.service';

@Injectable()
export class AuthenticationService implements AuthService {

    private userProfileSubject: BehaviorSubject<any>;

    constructor(
        private http: HttpClient,
        private tokenStorage: TokenStorage,
        private api: ApiService,
    ) {
        this.userProfileSubject = new BehaviorSubject<any>(null);
    }

    get user(): Observable<any> | any {
        return this.userProfileSubject
            .asObservable()
            .pipe(share());
    }

    set user(data: any) {
        this.userProfileSubject.next(data);
    }

    public isAuthorized(): Observable<boolean> {
        return this.tokenStorage
            .getAccessToken()
            .pipe(map(token => !!token));
    }

    public getAccessToken(): Observable<string> {
        return this.tokenStorage.getAccessToken();
    }

    public refreshToken(): any {

    }

    /*public refreshToken(): Observable<Token> {
        /!*return this.tokenStorage
            .getRefreshToken()
            .pipe(
                switchMap((refreshToken: string) =>
                    this.http.post(`http://localhost:3000/refresh`, {refreshToken}),
                ),
                tap((tokens: Token) => this.saveAccessData(tokens)),
                catchError((err) => {
                    this.logout();

                    return throwError(err);
                }),
            );*!/
    }*/

    public refreshShouldHappen(response: HttpErrorResponse): boolean {
        return response.status === 401;
    }

    public verifyTokenRequest(url: string): boolean {
        return url.endsWith('/refresh');
    }

    public login(credentials: any): Observable<any> {
        const url = `${this.api.baseUrl}/auth/login`;

        return this.http.post(url, credentials)
            .pipe(
                map((token: Token) => new Token(token)),
                tap((token: Token) => this.saveAccessData(token))
            );
    }

    public logout(): void {
        this.tokenStorage.clear();
        location.reload(true);
        localStorage.removeItem('key');
    }

    private saveAccessData(token: Token): void {
        this.tokenStorage
            .setAccessToken(token.accessToken);
    }

}
