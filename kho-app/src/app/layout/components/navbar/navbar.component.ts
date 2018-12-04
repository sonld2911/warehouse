import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LOCALE } from '@shared/config';

@Component({
    selector     : 'navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit
{
    // Private
    _variant: string;

    /**
     * Constructor
     *
     * @param {ElementRef} _elementRef
     * @param {Renderer2} _renderer
     * @param {TranslateService} translate
     */
    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2,
        private translate: TranslateService,
    )
    {
        // Set the private defaults
        this._variant = 'vertical-style-1';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Variant
     */
    get variant(): string
    {
        return this._variant;
    }

    @Input()
    set variant(value: string)
    {
        // Remove the old class name
        this._renderer.removeClass(this._elementRef.nativeElement, this.variant);

        // Store the variant value
        this._variant = value;

        // Add the new class name
        this._renderer.addClass(this._elementRef.nativeElement, value);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.translate.setDefaultLang('en-US');
            this.translate.setDefaultLang(DEFAULT_LOCALE);
        }, 0);

    }
}
