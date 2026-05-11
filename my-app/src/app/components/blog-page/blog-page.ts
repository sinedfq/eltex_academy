import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Article {
  id: number;
  title: string;
  text: string;
  date: string;
}

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blog-page.html',
  styleUrls: ['./blog-page.scss']
})
export class BlogPageComponent implements OnInit {
  private readonly STORAGE_KEY = 'blogArticles';
  
  @ViewChild('articleDialog') articleDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('statsDialog') statsDialog!: ElementRef<HTMLDialogElement>;

  articles: Article[] = [];
  isLoading = false; // По умолчанию false
  isMenuOpen = false;
  
  articleForm: FormGroup;
  isEditMode = false;
  currentEditingId: number | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(25)]],
      text: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      this.articles = saved ? JSON.parse(saved) : [];
      this.runLoader();
    }
  }

  private runLoader() {
    // ВРЕМЕННО ЗАКОММЕНТИРОВАНО (бесконечная загрузка / ожидание отключено)
    // this.isLoading = true;
    // setTimeout(() => this.isLoading = false, 1200);
    this.isLoading = false; 
  }

  // --- Методы формы ---

  openAddMode() {
    this.isEditMode = false;
    this.currentEditingId = null;
    this.articleForm.reset();
    this.articleDialog.nativeElement.showModal();
  }

  openEditMode(article: Article) {
    this.isEditMode = true;
    this.currentEditingId = article.id;
    this.articleForm.patchValue({
      title: article.title,
      text: article.text
    });
    this.articleDialog.nativeElement.showModal();
  }

  saveArticle() {
    if (this.articleForm.invalid) return;

    if (this.isEditMode) {
      const index = this.articles.findIndex(a => a.id === this.currentEditingId);
      if (index !== -1) {
        this.articles[index] = { 
          ...this.articles[index], 
          ...this.articleForm.value 
        };
      }
    } else {
      this.articles.unshift({
        id: Date.now(),
        ...this.articleForm.value,
        date: new Date().toLocaleDateString('ru-RU')
      });
    }

    this.syncData();
    this.closeArticleDialog();
  }

  deleteArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
    this.syncData();
  }

  private syncData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.articles));
    }
  }

  // --- UI ---

  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  closeArticleDialog() { this.articleDialog.nativeElement.close(); }
  openStatsDialog() { this.statsDialog.nativeElement.showModal(); }
  closeStatsDialog() { this.statsDialog.nativeElement.close(); }
}