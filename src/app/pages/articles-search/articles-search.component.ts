import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService, Article, Category, ModuleItem, Version } from '../../core/services/article.service';
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

  /* ----------------------------------------
     FILTROS
  ---------------------------------------- */
  keyword = '';
  version = 'All';
  category = 'All';
  module = 'All';

  results: Article[] = [];
  loading = false;
  hasSearched = false;

  /* ----------------------------------------
     AUTOCOMPLETE
  ---------------------------------------- */
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

    this.debounceTimer = setTimeout(() => {
      this.http
        .get<string[]>(`http://localhost:3000/api/suggestions?q=${value}`)
        .subscribe({
          next: (list) => {
            this.suggestions = list;
            this.showSuggestions = list.length > 0;
          },
          error: () => {
            this.suggestions = [];
            this.showSuggestions = false;
          }
        });
    }, 250);
  }

  selectSuggestion(value: string) {
    this.keyword = value;
    this.showSuggestions = false;
  }

  closeSuggestions() {
    setTimeout(() => (this.showSuggestions = false), 150);
  }

  /* ----------------------------------------
     🔥 FILTROS DINÁMICOS DESDE EL BACKEND
  ---------------------------------------- */

  categories: Category[] = [];
  versions: Version[] = [];
  modules: ModuleItem[] = [];

  ngOnInit() {
    this.api.getCategories().subscribe((c) => (this.categories = c));
    this.api.getVersions().subscribe((v) => (this.versions = v));
    this.api.getModules().subscribe((m) => (this.modules = m));
  }

  /* ----------------------------------------
     SEARCH REAL
  ---------------------------------------- */
  search() {
    this.loading = true;
    this.hasSearched = true;
    this.showSuggestions = false;

    const filters = {
      keyword: this.keyword.trim(),
      version: this.version !== 'All' ? this.version : '',
      category: this.category !== 'All' ? this.category : '',
      module: this.module !== 'All' ? this.module : ''
    };

    this.api.searchArticles(filters).subscribe({
      next: (list) => {
        this.results = list;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.loading = false;
      }
    });
  }

  /* ----------------------------------------
     CLEAR
  ---------------------------------------- */
  clearFilters() {
    this.keyword = '';
    this.version = 'All';
    this.category = 'All';
    this.module = 'All';
    this.results = [];
    this.hasSearched = false;
    this.suggestions = [];
    this.showSuggestions = false;
  }
}
