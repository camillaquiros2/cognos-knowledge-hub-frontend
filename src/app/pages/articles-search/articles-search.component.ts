import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../core/services/article.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-articles-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './articles-search.component.html',
  styleUrls: ['./articles-search.component.scss']
})
export class ArticlesSearchComponent {

  private api = inject(ArticleService);
  private http = inject(HttpClient);

  // ---------------- FILTROS ----------------
  keyword = '';
  version = '';
  category = '';
  module = '';

  results: Article[] = [];
  loading = false;
  hasSearched = false;

  // ---------------- AUTOCOMPLETE ----------------
  suggestions: string[] = [];
  showSuggestions = false;
  debounceTimer: any;

  onKeywordInput(value: string) {
    clearTimeout(this.debounceTimer);

    if (!value.trim()) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    // Debounce de 250ms
    this.debounceTimer = setTimeout(() => {
      this.http
        .get<string[]>(`http://localhost:3000/api/suggestions?q=${value}`)
        .subscribe({
          next: (s) => {
            this.suggestions = s;
            this.showSuggestions = s.length > 0;
          },
          error: () => {
            this.suggestions = [];
            this.showSuggestions = false;
          }
        });
    }, 250);
  }

  selectSuggestion(s: string) {
    this.keyword = s;
    this.showSuggestions = false;
  }

  closeSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }

  // ---------------- STATIC FILTERS ----------------
  categories = [
    'Installation',
    'Errors',
    'Compatibility',
    'Windows',
    'Linux',
    'Configuration',
    'Performance'
  ];

  versions = ['11.2.4', '12.0.1', '12.1.0 IF2'];

  modules = ['Server', 'Analytics', 'Admin'];

  private categoryMap: Record<string, string> = {
    installation: 'instalación',
    errors: 'errores',
    compatibility: 'compatibilidad'
  };

  // ---------------- SEARCH ----------------
  search() {
    this.loading = true;
    this.hasSearched = true;
    this.showSuggestions = false;

    this.api.list().subscribe({
      next: (all) => {
        const term = this.keyword.toLowerCase().trim();
        const version = this.version.toLowerCase().trim();
        const selectedCategory = this.category.toLowerCase().trim();
        const selectedModule = this.module.toLowerCase().trim();

        const categoryTranslated =
          this.categoryMap[selectedCategory] || selectedCategory;

        this.results = all.filter((a) => {
          const title = (a.title || '').toLowerCase();
          const summary = (a.summary || '').toLowerCase();
          const v = (a.version || '').toLowerCase();
          const c = (a.category || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          const m = (a.module || '').toLowerCase();

          const matchesKeyword =
            !term || title.includes(term) || summary.includes(term);

          const matchesVersion = !version || v.includes(version);

          const matchesCategory =
            !categoryTranslated ||
            c.includes(
              categoryTranslated.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            );

          const matchesModule = !selectedModule || m.includes(selectedModule);

          return (
            matchesKeyword &&
            matchesVersion &&
            matchesCategory &&
            matchesModule
          );
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching articles', err);
        this.loading = false;
      }
    });
  }

  // ---------------- CLEAR ----------------
  clearFilters() {
    this.keyword = '';
    this.version = '';
    this.category = '';
    this.module = '';
    this.results = [];
    this.hasSearched = false;
    this.suggestions = [];
    this.showSuggestions = false;
  }
}
