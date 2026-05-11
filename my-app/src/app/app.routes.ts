import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main';
import { BlogPageComponent } from './components/blog-page/blog-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent,
  },
  {
    path: 'blog',
    component: BlogPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
