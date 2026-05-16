import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main';
import { BlogPageComponent } from './pages/blog/blog-page';
import { ArticlePageComponent } from './pages/article/article-page/article-page';


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
    path: 'blog/:id',
    loadComponent: () =>
      import('./pages/article/article-page/article-page')
        .then(m => m.ArticlePageComponent)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
