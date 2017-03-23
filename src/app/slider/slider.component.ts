import {
    Component, OnInit, HostBinding, ViewChildren, ContentChildren, AfterViewInit,
    HostListener, ElementRef, AfterContentInit, QueryList, ViewChild, Renderer,
    ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import { Log, Level } from 'ng2-logger/ng2-logger';
const log = Log.create('slider.cmp')

import { ChildDirective } from "./child.directive";
import { ArrowDirective } from "./arrow.directive";

@Component({
    selector: 'scroll-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, AfterContentInit, AfterViewInit {

    @ContentChildren(ChildDirective) children: QueryList<ChildDirective>;
    @ViewChild('wrapper') wrapper: ElementRef;
    @ViewChild('container') container: ElementRef;
    @ViewChildren(ArrowDirective) arrows: QueryList<ArrowDirective>;
    @HostBinding('style.height.px') height: number = 0;

    get element(): Element {
        return this.container.nativeElement;
    }

    private maxHeight: number = 0;

    constructor(
        private e: ElementRef,
        private renderer: Renderer,
        private cd: ChangeDetectorRef
    ) {
        // this.element = e.nativeElement;
    }

    ngOnInit() { }



    ngAfterContentInit() {
        log.i('this.wrapper', this.wrapper)
        log.i('this.arrows', this.arrows)
        log.i('children', this.children.length)

        let widthOfAll = 0;
        this.children.forEach(c => {
            log.i('c', c)
            if (c.height > this.maxHeight) this.maxHeight = c.height;
            widthOfAll += c.width;
        })
        this.height = this.maxHeight;
        log.i('widthOfAll', widthOfAll)
        this.renderer.setElementStyle(this.wrapper.nativeElement, 'width', `${widthOfAll}px`);


    }

    ngAfterViewInit() {
        log.i('this.arrows', this.arrows)
        this.arrows.forEach(f => {
            f.height = this.maxHeight;
            f.lineHeight = this.maxHeight;
        });
        this.cd.markForCheck();
    }




    slider = {
        scrollMax: () => this.element.scrollWidth - this.element.clientWidth,
        scrollStep: 240,
        arrow: {
            left: {
                isVisible: () => this.element.scrollLeft > 0
            },
            right: {
                isVisible: () => this.element.scrollLeft < this.slider.scrollMax()
            }
        },
        move: {
            left: () => scrollLeftAnimate(this.element, - this.slider.scrollStep),
            right: () => scrollLeftAnimate(this.element, this.slider.scrollStep)
        }
    };


    public onMouseWheelFirefox(e) {
        e.preventDefault();
        let delta = parseInt(e.wheelDelta || -e.detail, undefined);
        this.element.scrollLeft += delta * -10;
        return false;
    }

    public onMouseWheel(e: WheelEvent) {
        e.preventDefault();
        this.element.scrollLeft += e.deltaY;
    }

    private startPos = 0;
    public onTouchStart(e: TouchEvent) {
        e.preventDefault();
        this.startPos = e.changedTouches[0].clientX;
        e.stopPropagation();
    }

    public onTouchEnd(e: TouchEvent) {
        e.preventDefault();
        let delta = this.startPos - e.changedTouches[0].clientX;
        scrollLeftAnimate(this.element, delta);
        e.stopPropagation();
    }


}



function scrollLeftAnimate(element: Element, step: number, recrusiveCall = false) {
    if (step === 0) return;
    if (!recrusiveCall) scrollLeftAnimate.prototype.endpoint = element.scrollLeft + step;
    if (scrollLeftAnimate.prototype.started !== undefined
        && scrollLeftAnimate.prototype.started
        && !recrusiveCall) return;

    scrollLeftAnimate.prototype.started = true;
    setTimeout(function () {
        let before = element.scrollLeft;
        element.scrollLeft += step > 0 ? 1 : -1;

        if (element.scrollLeft === before ||
            element.scrollLeft === scrollLeftAnimate.prototype.endpoint) {
            scrollLeftAnimate.prototype.started = false;
            return;
        }
        scrollLeftAnimate(element, step, true);
    }, 0);
}
