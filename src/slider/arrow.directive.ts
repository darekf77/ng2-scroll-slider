import {
    Component, OnInit, Directive, Input
    , ElementRef, HostBinding, Renderer
} from '@angular/core';

@Directive({ selector: '[arrow]' })
export class ArrowDirective implements OnInit {

    @Input() @HostBinding('style.height.px') height: number;
    @Input() @HostBinding('style.lineHeight.px') lineHeight: number;



    constructor(private el: ElementRef, private renderer: Renderer) {

    }

    ngOnInit() {
        
        let style = window.getComputedStyle(this.el.nativeElement, undefined);

        let h = Number(style.height.replace('px', ''));
        this.height = h;

    }


}