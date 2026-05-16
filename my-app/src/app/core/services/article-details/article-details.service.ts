import {
  Injectable
} from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import {
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import { ArticleDetails }
  from '../../models/article-details.model';

import { ArticleComment }
  from '../../models/article-comment.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleDetailsService {

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) { }

  private readonly STORAGE_KEY =
    'blogArticles';

  public getArticleDetails(
    articleId: number
  ): Observable<ArticleDetails | null> {

    const articles =
      this.getArticlesFromStorage();

    const article =
      articles.find(
        article => article.id === articleId
      );

    if (!article) {
      return of(null);
    }

    const articleDetails:
      ArticleDetails = {

      ...article,

      rating:
        article.rating ?? 0,

      comments:
        article.comments ?? []
    };

    return of(articleDetails);
  }

  public addComment(
    articleId: number,
    commentData: Omit<
      ArticleComment,
      'id' | 'date' | 'rating'
    >
  ): Observable<ArticleDetails | null> {

    const articles =
      this.getArticlesFromStorage();

    const article =
      articles.find(
        item => item.id === articleId
      );

    if (!article) {
      return of(null);
    }

    if (!article.comments) {
      article.comments = [];
    }

    article.comments.unshift({
      id: Date.now(),

      ...commentData,

      date:
        new Date()
          .toLocaleDateString('ru-RU'),

      rating: 0
    });

    this.saveArticles(
      articles
    );

    return this.getArticleDetails(
      articleId
    );
  }

  public changeArticleRating(
    articleId: number,
    value: number
  ): Observable<ArticleDetails | null> {

    const articles =
      this.getArticlesFromStorage();

    const article =
      articles.find(
        item => item.id === articleId
      );

    if (!article) {
      return of(null);
    }

    article.rating =
      (article.rating ?? 0)
      + value;

    this.saveArticles(
      articles
    );

    return this.getArticleDetails(
      articleId
    );
  }

  public changeCommentRating(
    articleId: number,
    commentId: number,
    value: number
  ): Observable<ArticleDetails | null> {

    const articles =
      this.getArticlesFromStorage();

    const article =
      articles.find(
        item => item.id === articleId
      );

    if (!article) {
      return of(null);
    }

    const comment =
      article.comments?.find(
        (item: ArticleComment) =>
          item.id === commentId
      );

    if (!comment) {
      return of(null);
    }

    comment.rating += value;

    this.saveArticles(
      articles
    );

    return this.getArticleDetails(
      articleId
    );
  }

  private getArticlesFromStorage():
    any[] {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return [];
    }

    const saved =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    return saved
      ? JSON.parse(saved)
      : [];
  }

  private saveArticles(
    articles: any[]
  ): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(articles)
    );
  }
}