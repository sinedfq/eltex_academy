import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  ActivatedRoute
} from '@angular/router';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatInputModule
} from '@angular/material/input';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Title
} from '@angular/platform-browser';

import {
  ArticleDetailsService
} from '../../../core/services/article-details/article-details.service';

import {
  ArticleDetailsStoreService
} from '../../../core/stores/article-details-store.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-article-page',

  standalone: true,

  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIcon
  ],

  templateUrl: './article-page.html',

  styleUrls: ['./article-page.scss'],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ArticlePageComponent
  implements OnInit {

  private readonly title =
    inject(Title);

  private readonly route =
    inject(ActivatedRoute);

  private readonly articleService =
    inject(ArticleDetailsService);

  private readonly fb =
    inject(FormBuilder);

  protected readonly store =
    inject(
      ArticleDetailsStoreService
    );

  protected commentForm =
    this.fb.group({

      username: [
        '',
        [
          Validators.required
        ]
      ],

      text: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ]
    });
  public ngOnInit():
    void {

    const articleId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.articleService
      .getArticleDetails(articleId)
      .subscribe(article => {

        this.store.setArticle(
          article
        );

        if (article) {

          this.title.setTitle(
            article.title
          );
        }
      });
  }
  

  protected changeRating(
    value: number
  ): void {

    const article =
      this.store.article();

    if (!article) {
      return;
    }

    this.articleService
      .changeArticleRating(
        article.id,
        value
      )
      .subscribe(updated => {

        this.store.setArticle(
          updated
        );
      });
  }
  protected addComment():
    void {

    if (
      this.commentForm.invalid
    ) {
      return;
    }

    const article =
      this.store.article();

    if (!article) {
      return;
    }

    this.articleService
      .addComment(
        article.id,

        {
          username:
            this.commentForm.value.username!,

          text:
            this.commentForm.value.text!
        }
      )
      .subscribe(updated => {

        this.store.setArticle(
          updated
        );

        this.commentForm.reset();
      });
  }
  protected changeCommentRating(
    commentId: number,
    value: number
  ): void {

    const article =
      this.store.article();

    if (!article) {
      return;
    }

    this.articleService
      .changeCommentRating(
        article.id,
        commentId,
        value
      )
      .subscribe(updated => {

        this.store.setArticle(
          updated
        );
      });
  }

} 