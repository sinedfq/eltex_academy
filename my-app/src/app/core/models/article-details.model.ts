import { Article }
from './article.model';

import { ArticleComment }
from './article-comment.model';

export interface ArticleDetails
extends Article {

  rating: number;

  comments: ArticleComment[];
}