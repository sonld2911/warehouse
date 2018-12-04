import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ConfirmedPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

        if (!control) {
            return null;
        }

        const password = control.get('password').value;
        const passwordConfirmation = control.get('passwordConfirmation').value;

        if (password !== passwordConfirmation) {
            control.get('passwordConfirmation').setErrors({'matchPassword': true});
        } else {
            return null;
        }
    };
}
