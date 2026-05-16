import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  ARTICLES_SERVICE_TOKEN
} from '../../../core/services/articles/articles-service.token';

import {
  ArticlesStoreService
} from '../../../core/services/articles/articles-store.service';

import {
  Article
} from '../../../core/models/article.model';

@Component({
  selector: 'app-articles',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './articles.html',

  styleUrl: './articles.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class Articles
implements OnInit {

  private readonly articlesService =
    inject(ARTICLES_SERVICE_TOKEN);

  protected readonly store =
    inject(ArticlesStoreService);

  protected latestArticles =
    signal<Article[]>([]);

  public ngOnInit():
    void {

    this.loadArticles();
  }

  private loadArticles():
    void {

    if (
      this.store.articles().length
    ) {

      this.latestArticles.set(
        this.store
          .articles()
          .slice(0, 2)
      );

      return;
    }

    this.articlesService
      .getArticles(1, 2)
      .subscribe(response => {

        // response is an array of Article
        this.store.setArticles(response);

        this.latestArticles.set(response);
      });
  }
}