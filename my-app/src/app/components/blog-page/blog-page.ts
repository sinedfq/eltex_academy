import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  PLATFORM_ID,
  signal
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { Article } from './models/article.model';

import {ArticleCardComponent} from './components/article-card/article-card';
import { ArticleDialogComponent } from './components/article-dialog/article-dialog';
import { StatsDialogComponent } from './components/stats-dialog/stats-dialog';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogPageComponent {

  private readonly STORAGE_KEY = 'blogArticles';

  protected articles = signal<Article[]>([]);
  protected isLoading = signal(false);

  protected isMenuOpen = signal(false);

  protected isArticleDialogOpen = signal(false);
  protected isStatsDialogOpen = signal(false);

  protected editingArticle = signal<Article | null>(null);

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {}

  async ngOnInit(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initializeBlog();
  }

  protected openAddMode(): void {
    this.editingArticle.set(null);
    this.isArticleDialogOpen.set(true);
  }

  protected openEditMode(article: Article): void {
    this.editingArticle.set(article);
    this.isArticleDialogOpen.set(true);
  }

  protected closeArticleDialog(): void {
    this.isArticleDialogOpen.set(false);
  }

  protected openStatsDialog(): void {
    this.isStatsDialogOpen.set(true);
  }

  protected closeStatsDialog(): void {
    this.isStatsDialogOpen.set(false);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected saveArticle(
    articleData: Omit<Article, 'id' | 'date'>
  ): void {

    const currentArticle = this.editingArticle();

    if (currentArticle) {

      this.articles.update(articles =>
        articles.map(article =>
          article.id === currentArticle.id
            ? {
                ...article,
                ...articleData
              }
            : article
        )
      );

    } else {

      const newArticle: Article = {
        id: Date.now(),
        ...articleData,
        date: new Date().toLocaleDateString('ru-RU')
      };

      this.articles.update(articles => [
        newArticle,
        ...articles
      ]);
    }

    this.syncData();

    this.closeArticleDialog();
  }

  protected deleteArticle(id: number): void {

    this.articles.update(articles =>
      articles.filter(article => article.id !== id)
    );

    this.syncData();
  }

  private async initializeBlog(): Promise<void> {

    this.isLoading.set(true);

    const saved =
      localStorage.getItem(this.STORAGE_KEY);

    this.articles.set(
      saved
        ? JSON.parse(saved)
        : []
    );

    await this.wait(1200);

    this.isLoading.set(false);
  }

  private syncData(): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.articles())
    );
  }

  private wait(ms: number): Promise<void> {

    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}