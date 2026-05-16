import { Observable } from 'rxjs';

import { Article }
from '../../models/article.model';

export interface ArticlesServiceInterface {

  getArticles(
    page: number,
    limit: number
  ): Observable<Article[]>;

  getArticlesCount():
    Observable<number>;

  addArticle(
    article:
    Omit<Article, 'id' | 'date'>
  ): Observable<Article[]>;

  updateArticle(
    id: number,
    article:
    Omit<Article, 'id' | 'date'>
  ): Observable<Article[]>;

  deleteArticle(
    id: number
  ): Observable<Article[]>;
}