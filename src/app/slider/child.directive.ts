import {
    Component, OnInit, Directive, Input
    , ElementRef, HostBinding, Renderer
} from '@angular/core';

@Directive({ selector: '[child]' })
export class ChildDirective implements OnInit {

    @Input() @HostBinding('style.height.px') height: number;
    @Input() @HostBinding('style.width.px') width: number;



    constructor(private el: ElementRef, private renderer: Renderer) {

    }

    ngOnInit() {
        let style = window.getComputedStyle(this.el.nativeElement, undefined);

        let h = Number(style.height.replace('px', ''));
        this.height = h;

        let w = Number(style.width.replace('px', ''));
        this.width = w;

        this.renderer.setElementStyle(this.el.nativeElement, 'box-sizing', 'border-box')
    }


}