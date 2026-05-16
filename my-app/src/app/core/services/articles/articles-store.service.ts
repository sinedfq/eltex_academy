import {
  Injectable,
  signal
} from '@angular/core';


import { Article }
from '../../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesStoreService {

  public articles =
    signal<Article[]>([]);

  public activePage =
    signal(1);

  public totalCount =
    signal(0);

  public setArticles(
    articles: Article[]
  ): void {

    this.articles.set(articles);
  }

  public setActivePage(
    page: number
  ): void {

    this.activePage.set(page);
  }

  public setTotalCount(
    count: number
  ): void {

    this.totalCount.set(count);
  }
}