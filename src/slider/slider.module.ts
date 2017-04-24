import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderComponent } from './slider.component';
import { ChildDirective } from "./child.directive";
import { ArrowDirective } from "./arrow.directive";

const cmp = [
    SliderComponent, ChildDirective, ArrowDirective
]

@NgModule({
    imports: [CommonModule],
    exports: [...cmp],
    declarations: [...cmp]
})
export class Ng2ScrollSliderModule { }
