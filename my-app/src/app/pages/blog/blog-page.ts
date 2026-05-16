import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { ArticleCardComponent }
from './components/article-card/article-card';

import { ArticleDialogComponent }
from './components/article-dialog/article-dialog';

import { StatsDialogComponent }
from './components/stats-dialog/stats-dialog';

import { Article }
from '../../core/models/article.model';

import {
  ARTICLES_SERVICE_TOKEN
} from '../../core/services/articles/articles-service.token';

import {
  ArticlesStoreService
} from '../../core/services/articles/articles-store.service';

@Component({
  selector: 'app-blog-page',
  standalone: true,

  imports: [
    CommonModule,
    ArticleCardComponent,
    ArticleDialogComponent,
    StatsDialogComponent
  ],

  templateUrl: './blog-page.html',

  styleUrls: ['./blog-page.scss'],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class BlogPageComponent
implements OnInit {

  protected isLoading =
    signal(false);

  protected isMenuOpen =
    signal(false);

  protected isArticleDialogOpen =
    signal(false);

  protected isStatsDialogOpen =
    signal(false);

  protected editingArticle =
    signal<Article | null>(null);

  protected readonly store =
    inject(ArticlesStoreService);

  private readonly articlesService =
    inject(ARTICLES_SERVICE_TOKEN);

  protected readonly PAGE_SIZE = 7;

  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: Object
  ) { }

  public async ngOnInit():
    Promise<void> {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    await this.initializeBlog();
  }

  protected openAddMode():
    void {

    this.editingArticle.set(
      null
    );

    this.isArticleDialogOpen
      .set(true);
  }

  protected openEditMode(
    article: Article
  ): void {

    this.editingArticle.set(
      article
    );

    this.isArticleDialogOpen
      .set(true);
  }

  protected closeArticleDialog():
    void {

    this.isArticleDialogOpen
      .set(false);
  }

  protected openStatsDialog():
    void {

    this.isStatsDialogOpen
      .set(true);
  }

  protected closeStatsDialog():
    void {

    this.isStatsDialogOpen
      .set(false);
  }

  protected toggleMenu():
    void {

    this.isMenuOpen.update(
      value => !value
    );
  }

  protected saveArticle(
    articleData:
    Omit<Article, 'id' | 'date'>
  ): void {

    const currentArticle =
      this.editingArticle();

    if (currentArticle) {

      this.articlesService
        .updateArticle(
          currentArticle.id,
          articleData
        )
        .subscribe(() => {

          this.loadArticles();

          this.closeArticleDialog();
        });

      return;
    }

    this.articlesService
      .addArticle(articleData)
      .subscribe(() => {

        this.loadArticles();

        this.closeArticleDialog();
      });
  }

  protected deleteArticle(
    id: number
  ): void {

    this.articlesService
      .deleteArticle(id)
      .subscribe(() => {

        this.loadArticles();
      });
  }

  protected nextPage():
    void {

    const nextPage =
      this.store.activePage() + 1;

    const maxPage =
      Math.ceil(
        this.store.totalCount()
        / this.PAGE_SIZE
      );

    if (nextPage > maxPage) {
      return;
    }

    this.store.setActivePage(
      nextPage
    );

    this.loadArticles();
  }

  protected prevPage():
    void {

    const currentPage =
      this.store.activePage();

    if (currentPage <= 1) {
      return;
    }

    this.store.setActivePage(
      currentPage - 1
    );

    this.loadArticles();
  }

  protected loadArticles():
    void {

    this.articlesService
      .getArticles(
        this.store.activePage(),
        this.PAGE_SIZE
      )
      .subscribe(articles => {

        this.store.setArticles(
          articles
        );
      });

    this.articlesService
      .getArticlesCount()
      .subscribe(count => {

        this.store.setTotalCount(
          count
        );
      });
  }

  private async initializeBlog():
    Promise<void> {

    this.isLoading.set(true);

    this.loadArticles();

    await this.wait(1200);

    this.isLoading.set(false);
  }

  private wait(
    ms: number
  ): Promise<void> {

    return new Promise(resolve => {

      setTimeout(
        resolve,
        ms
      );
    });
  }
}