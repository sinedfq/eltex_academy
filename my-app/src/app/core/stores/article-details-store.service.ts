import {
  Injectable,
  signal
} from '@angular/core';



import { ArticleDetails } from '../models/article-details.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleDetailsStoreService {

  public article =
    signal<ArticleDetails | null>(
      null
    );

  public setArticle(
    article: ArticleDetails | null
  ): void {

    this.article.set(
      article
    );
  }
}