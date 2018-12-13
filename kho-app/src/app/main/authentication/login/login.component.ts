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
                    console.log(user);
                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 1000);
                },
                () => {
                    this.loginError = true;
                },
            );
    }
}
