import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent }
];
