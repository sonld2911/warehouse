import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '@shared/modules/authentication';
import { concatMap, finalize } from 'rxjs/operators';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models';
import { DEFAULT_LOCALE } from '@shared/config';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LoginComponent implements OnInit {
    Pusher = require('pusher-js');

    loginForm: FormGroup;

    loading: boolean;

    loginError: boolean;

    loginSuccess: boolean;

    constructor(
        private fuseConfigService: FuseConfigService,
        private formBuilder: FormBuilder,
        private auth: AuthenticationService,
        private progressBar: FuseProgressBarService,
        private router: Router,
        private userService: UserService,
        private translate: TranslateService,
    ) {
        this.fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };

        this.loading = false;

        this.loginError = false;

        this.loginSuccess = false;
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
        });
    }

    login(): void {
        this.loginError = false;
        this.loading = true;
        this.progressBar.show();

        const credentials = this.loginForm.value;

        this.loginForm.disable();

        this.auth.login(credentials)
            .pipe(
                concatMap(() => {
                    return this.userService.me();
                }),
                finalize(() => {
                    this.loading = false;
                    this.progressBar.hide();
                    this.loginForm.enable();
                }),
            )
            .subscribe(
                (user: User) => {
                    this.auth.user = user;
                    this.loginForm.disable();
                    this.loginSuccess = true;
                    localStorage.setItem('key', user.username);
                    const name = localStorage.getItem('name');
                    console.log(name);
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 1000);
                    this.notification(user.username);
                },
                () => {
                    this.loginError = true;
                },
            );
    }
    notification (user): void {
        console.log(user);
        const pusher = new this.Pusher('32f3c61f78d9f66b2d26', { cluster: 'ap1', forceTLS: true});
        const axios = require('axios');

        // retrieve the socket ID once we're connected
        pusher.connection.bind('connected', function (): void  {
            // attach the socket ID to all outgoing Axios requests
            axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
            console.log('socketID: ', pusher.connection.socket_id);
        });
        Notification.requestPermission();
        pusher.subscribe(user)
                .bind('post_updated', function (post): void {
                    console.log(post);
                    const notification = new Notification('trung đang gửi notification',
                    {
                        icon: 'https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png',
                        body: 'Hey there! You ve been notified!',
                    });
                    notification.onclick = function (event): void {
                        window.location.href = '/posts/' + post._id;
                        event.preventDefault();
                        notification.close();
                    };
                });
    }
}
