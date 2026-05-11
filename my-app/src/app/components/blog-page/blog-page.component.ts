import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BlogArticle {
  title: string;
  text: string;
  date: string;
}

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent implements OnInit {

  private readonly BLOG_STORAGE_KEY = 'blogArticles';
  private readonly INITIAL_LOAD_DELAY_MS = 1200;

  articles: BlogArticle[] = [];

  isLoading = false;
  isMenuOpen = false;

  newArticle = {
    title: '',
    text: ''
  };

  @ViewChild('addDialog') addDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('statsDialog') statsDialog!: ElementRef<HTMLDialogElement>;

  ngOnInit(): void {
    this.loadArticles();
    this.initializeBlog();
  }

  async initializeBlog(): Promise<void> {

    this.setLoadingState(true);

    await this.wait(this.INITIAL_LOAD_DELAY_MS);

    setTimeout(() => {
      this.setLoadingState(false);
    });
  }

  setLoadingState(state: boolean): void {
    this.isLoading = state;
  }

  wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  loadArticles(): void {
    try {
      const saved = localStorage.getItem(this.BLOG_STORAGE_KEY);

      this.articles = saved ? JSON.parse(saved) : [];
    } catch {
      this.articles = [];
    }
  }

  saveArticles(): void {
    localStorage.setItem(
      this.BLOG_STORAGE_KEY,
      JSON.stringify(this.articles)
    );
  }

  openAddDialog(): void {

    if (this.isLoading) {
      return;
    }

    this.addDialog.nativeElement.showModal();
  }

  closeAddDialog(): void {
    this.addDialog.nativeElement.close();
  }

  openStatsDialog(): void {

    if (this.isLoading) {
      return;
    }

    this.statsDialog.nativeElement.showModal();
  }

  closeStatsDialog(): void {
    this.statsDialog.nativeElement.close();
  }

  toggleMenu(): void {

    if (this.isLoading) {
      return;
    }

    this.isMenuOpen = !this.isMenuOpen;
  }

  addArticle(): void {

    if (this.isLoading) {
      return;
    }

    const title = this.newArticle.title.trim();
    const text = this.newArticle.text.trim();

    if (!title || !text) {
      return;
    }

    this.articles.push({
      title,
      text,
      date: new Date().toLocaleDateString('ru-RU')
    });

    this.saveArticles();

    this.newArticle = {
      title: '',
      text: ''
    };

    this.closeAddDialog();
  }

  deleteArticle(index: number): void {

    if (this.isLoading) {
      return;
    }

    this.articles.splice(index, 1);

    this.saveArticles();
  }

  get articlesCount(): number {
    return this.articles.length;
  }

  get commentsCount(): number {
    return 0;
  }
}