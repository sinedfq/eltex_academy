import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-card',
  standalone: true,
  templateUrl: './article-card.html',
  styleUrls: ['./article-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent {
  public article = input.required<Article>();

  public edit = output<Article>();
  public remove = output<number>();

  protected onEdit(): void {
    this.edit.emit(this.article());
  }

  protected onDelete(): void {
    this.remove.emit(this.article().id);
  }
}