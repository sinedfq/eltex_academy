import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main';
import { BlogPageComponent } from './pages/blog/blog-page';

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
