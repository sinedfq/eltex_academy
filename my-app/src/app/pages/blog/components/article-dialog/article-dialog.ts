import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output
} from '@angular/core';


import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Article } from '../../../../core/models/article.model';

@Component({
  selector: 'app-article-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './article-dialog.html',
  styleUrls: ['./article-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDialogComponent {

  private readonly fb = inject(FormBuilder);

  public articleToEdit = input<Article | null>(null);

  public closeDialog = output<void>();
  public save = output<Omit<Article, 'id' | 'date'>>();

  protected formTitle = computed(() => {
    return this.articleToEdit()
      ? 'Изменить статью'
      : 'Создание статьи';
  });

  protected saveButtonTitle = computed(() => {
    return this.articleToEdit()
      ? 'Сохранить'
      : 'Добавить';
  });

  protected articleForm: FormGroup = this.fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(25)
      ]
    ],

    text: [
      '',
      [
        Validators.required
      ]
    ]
  });

  constructor() {
    this.editDataEffect();
  }

  protected submit(): void {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.articleForm.value);
  }

  protected close(): void {
    this.closeDialog.emit();
  }

  protected hasError(controlName: string): boolean {
    const control = this.articleForm.get(controlName);

    return Boolean(
      control?.invalid &&
      control?.touched
    );
  }

  protected getControlErrors(controlName: string): string[] {
    const control = this.articleForm.get(controlName);

    if (!control?.errors) {
      return [];
    }

    return Object.entries(control.errors).map(
      ([errorKey, errorValue]) =>
        this.getErrorStr(errorKey, errorValue)
    );
  }

  private getErrorStr(
    errorCode: string,
    errorData: unknown
  ): string {

    switch (errorCode) {

      case 'required':
        return 'Поле обязательно';

      case 'minlength':
        const {
          requiredLength,
          actualLength
        } = errorData as {
          requiredLength: number;
          actualLength: number;
        };

        return `Нужно еще ${requiredLength - actualLength
          } символов`;

      default:
        return 'Ошибка поля';
    }
  }

  private editDataEffect(): void {
    effect(() => {

      const article = this.articleToEdit();

      if (article) {
        this.articleForm.reset({
          title: article.title,
          text: article.text
        });

        return;
      }

      this.articleForm.reset();
    });
  }
}