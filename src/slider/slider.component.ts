import {
    Component, OnInit, HostBinding, ViewChildren, ContentChildren, AfterViewInit,
    HostListener, ElementRef, AfterContentInit, QueryList, ViewChild, Renderer,
    ChangeDetectionStrategy, ChangeDetectorRef, NgZone
} from '@angular/core';



import { Log, Level } from 'ng2-logger';
const log = Log.create('slider.cmp', Level.__NOTHING)

import { ChildDirective } from "./child.directive";
import { ArrowDirective } from "./arrow.directive";
import { debounceable } from './debounce';

@Component({
    selector: 'scroll-slider',
    template: `
    <div class="nav-buttons">
    <div>
        <div class="arrow left" arrow [ngClass]="{'normalOpacity': slider.arrow.left.isVisible()}" 
        (mousedown)="onMouseDown($event,'left')" (mouseup)="onMouseUp()" >

            <span class="fa fa-arrow-left"> &lt;  </span>
        </div>
        <div class="arrow right" arrow [ngClass]="{'normalOpacity': slider.arrow.right.isVisible()}" 
        (mousedown)="onMouseDown($event,'right')" (mouseup)="onMouseUp()" >

            <span class="fa fa-arrow-right"> &gt;  </span>
        </div>
    </div>
</div>
<div class="container" #container >
    <div class="items-wrapper" #wrapper
        (DOMMouseScroll)="onMouseWheelFirefox($event)"
        (mousewheel)="onMouseWheel($event)"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
        (touchmove)="onTouchMove($event)"
    >
        <ng-content></ng-content>
    </div>

</div>
    
    `,
    styles: [`
    
    :host {
        display: block;
        }
        :host .container {
        display: block;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        }
        :host .container .items-wrapper {
        width: 100%;
        height: 100%;
        }

        .nav-buttons {
        width: 100%;
        display: block;
        position: relative;
        }
        .nav-buttons > div {
        width: 100%;
        position: relative;
        }
        .nav-buttons > div div.arrow {
        width: 30px !important;
        position: absolute;
        z-index: 1;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.3);
        color: white;
        opacity: 0.0;
        -webkit-transition: all 0.5s ease-out;
        -moz-transition: all 0.5s ease-out;
        -ms-transition: all 0.5s ease-out;
        -o-transition: all 0.5s ease-out;
        transition: all 0.5s ease-out;
        pointer-events: none;
        }
        .nav-buttons > div div.arrow.left {
        float: left;
        }
        .nav-buttons > div div.arrow.right {
        float: right;
        right: 0px;
        }
        .nav-buttons > div div.arrow.normalOpacity {
        pointer-events: all;
        opacity: 1.0;
        }
        .nav-buttons > div div.arrow span {
        position: relative;
        top: -8px;
        left: 1px;
        }

    
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit, AfterContentInit, AfterViewInit {

    @ContentChildren(ChildDirective) public children: QueryList<ChildDirective>;
    @ViewChild('wrapper') public wrapper: ElementRef;
    @ViewChild('container') public container: ElementRef;
    @ViewChildren(ArrowDirective) public arrows: QueryList<ArrowDirective>;
    @HostBinding('style.height.px') public height: number = 0;

    get element(): Element {
        return this.container.nativeElement;
    }

    private maxHeight: number = 0;

    constructor(
        private renderer: Renderer,
        private cd: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        // this.element = e.nativeElement;


        window.onresize = () => {
            ngZone.run(() => {
                this.cd.markForCheck();
            });
        };

    }

    public ngOnInit() { }



    public ngAfterContentInit() {
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
        setTimeout(() => {
            this.arrows.forEach(f => {
                f.height = this.maxHeight;
                f.lineHeight = this.maxHeight;
            });
            this.cd.markForCheck();
        })

    }




    public slider = {
        scrollMax: () => this.element.scrollWidth - this.element.clientWidth,
        scrollStep: 20,
        scrollCurrent: () => this.element.scrollWidth,
        arrow: {
            left: {
                isVisible: () => this.element.scrollLeft > 0
            },
            right: {
                isVisible: () => this.element.scrollLeft < this.slider.scrollMax()
            }
        },
        move: {
            left: () => {
                this.scrollLeftAnimate(this.element, - this.slider.scrollStep)
            },
            right: () => {
                this.scrollLeftAnimate(this.element, this.slider.scrollStep);
            }

        }
    };

    public onMouseDown(e: MouseEvent, direction: 'right' | 'left') {
        log.i('down')
        this.animation.stop = false;
        if (direction === 'right') {
            this.slider.move.right();
        } else if (direction === 'left') {
            this.slider.move.left();
        }
        setTimeout(() => {
            if (this.animation.stop) return;
            this.onMouseDown(e, direction);
        })
    }

    public onMouseUp(e: MouseEvent) {
        this.animation.stop = true;
    }

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
        this.animation.stop = false;
    }

    public onTouchEnd(e: TouchEvent) {
        e.preventDefault();
        this.animation.stop = true;
        // let delta = this.startPos - e.changedTouches[0].clientX;
        // scrollLeftAnimate(this.element,  this.slider.scrollCurrent() );
        e.stopPropagation();
    }

    public onTouchMove(e: TouchEvent) {
        log.i('move')
        e.preventDefault();
        let delta = this.startPos - e.changedTouches[0].clientX;
        this.scrollLeftAnimate(this.element, delta);
        e.stopPropagation();
    }


    animation = {
        started: false,
        stop: false,
        endpoint: undefined
    }

    // @debounceable(100, undefined)
    // scrollLeftAnimateWithDebounce(element: Element, step: number, recrusiveCall = false) {
    //     this.scrollLeftAnimate(element, step, recrusiveCall);
    // }

    scrollLeftAnimate(element: Element, step: number, recrusiveCall = false) {
        if (this.animation.stop) return;
        if (step === 0) return;
        if (!recrusiveCall) this.animation.endpoint = element.scrollLeft + step;
        if (this.animation.started !== undefined
            && this.animation.started
            && !recrusiveCall) return;

        setTimeout(() => {
            let before = element.scrollLeft;
            element.scrollLeft += step > 0 ? 1 : -1;

            if (element.scrollLeft === before ||
                element.scrollLeft === this.animation.endpoint) {
                this.animation.started = false;
                return;
            }
            // if (scrollLeftAnimate.prototype.stop) return;
            this.scrollLeftAnimate(element, step, true);
        }, 0);
    }


}




