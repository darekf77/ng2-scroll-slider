import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderComponent } from './slider.component';
import { ChildDirective } from './child.directive';
import { ArrowDirective } from './arrow.directive';


@NgModule({
    imports: [CommonModule],
    exports: [SliderComponent, ChildDirective, ArrowDirective],
    declarations: [SliderComponent, ChildDirective, ArrowDirective]
})
export class Ng2ScrollSliderModule { }