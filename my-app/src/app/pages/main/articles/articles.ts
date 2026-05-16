import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ArticleItem {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class Articles {
  protected readonly articles = signal<ArticleItem[]>([
    {
      id: 1,
      title: 'Как создать адаптивный дизайн за 30 минут',
      date: '15 декабря 2024',
      description:
        'В этой статье я расскажу о ключевых принципах создания мобильных интерфейсов, которые одинаково хорошо выглядят на всех устройствах.',
      image: 'https://via.placeholder.com/420x320?text=Adaptive+Design',
    },
    {
      id: 2,
      title: 'UX-паттерны для удобных интерфейсов',
      date: '2 января 2025',
      description:
        'Разбираем практические UX-паттерны для ленты статей, карточек и кнопок, которые помогают пользователю быстро понимать содержимое.',
      image: 'https://via.placeholder.com/420x320?text=UX+Patterns',
    },
    {
      id: 3,
      title: 'Структура статьи: как писать ясно',
      date: '30 марта 2025',
      description:
        'Простая структура, логичные заголовки и краткие абзацы помогают читателю быстро найти нужную информацию.',
      image: 'https://via.placeholder.com/420x320?text=Writing+Tips',
    },
  ]);

  protected trackById(index: number, article: ArticleItem) {
    return article.id;
  }
}
