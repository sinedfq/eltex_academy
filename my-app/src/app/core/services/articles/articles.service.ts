import {
  Injectable
} from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import { Article }
from '../../models/article.model';

import {
  ArticlesServiceInterface
} from './articles-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService
implements ArticlesServiceInterface {

  private readonly STORAGE_KEY =
    'blogArticles';

  public getArticles(
    page: number,
    limit: number
  ): Observable<Article[]> {

    const articles =
      this.getAllArticles();

    const start =
      (page - 1) * limit;

    const paginated =
      articles.slice(
        start,
        start + limit
      );

    return of(paginated);
  }

  public getArticlesCount():
    Observable<number> {

    return of(
      this.getAllArticles().length
    );
  }

  public addArticle(
    articleData:
    Omit<Article, 'id' | 'date'>
  ): Observable<Article[]> {

    const articles =
      this.getAllArticles();

    const newArticle: Article = {
      id: Date.now(),
      ...articleData,
      date: new Date()
        .toLocaleDateString('ru-RU')
    };

    articles.unshift(newArticle);

    this.saveArticles(articles);

    return of(articles);
  }

  public updateArticle(
    id: number,
    articleData:
    Omit<Article, 'id' | 'date'>
  ): Observable<Article[]> {

    const updated =
      this.getAllArticles().map(
        article =>
          article.id === id
            ? {
                ...article,
                ...articleData
              }
            : article
      );

    this.saveArticles(updated);

    return of(updated);
  }

  public deleteArticle(
    id: number
  ): Observable<Article[]> {

    const filtered =
      this.getAllArticles()
        .filter(
          article =>
            article.id !== id
        );

    this.saveArticles(filtered);

    return of(filtered);
  }

  private getAllArticles():
    Article[] {

    const data =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    return data
      ? JSON.parse(data)
      : [];
  }

  private saveArticles(
    articles: Article[]
  ): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(articles)
    );
  }
}