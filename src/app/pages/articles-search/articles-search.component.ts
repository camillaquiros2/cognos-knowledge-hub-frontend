import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../core/services/article.service';

@Component({
  selector: 'app-articles-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './articles-search.component.html',
  styleUrls: ['./articles-search.component.scss']
})
export class ArticlesSearchComponent {
  private api = inject(ArticleService);

  keyword = '';
  version = '';
  category = '';
  module = '';

  results: Article[] = [];
  loading = false;
  hasSearched = false;

  // ✅ Categories shown in English but matched to DB (Spanish)
  categories = [
    'Installation',
    'Errors',
    'Compatibility',
    'Windows',
    'Linux',
    'Configuration',
    'Performance'
  ];

  // ✅ Versions (frontend only)
  versions = ['11.2.4', '12.0.1', '12.1.0 IF2'];

  // ✅ Modules in English (DB values are already in English)
  modules = ['Server', 'Analytics', 'Admin'];

  // ✅ Category map for DB
  private categoryMap: Record<string, string> = {
    installation: 'instalación',
    errors: 'errores',
    compatibility: 'compatibilidad'
  };

  search() {
    this.loading = true;
    this.hasSearched = true;

    this.api.list().subscribe({
      next: (all) => {
        const term = this.keyword.toLowerCase().trim();
        const version = this.version.toLowerCase().trim();
        const selectedCategory = this.category.toLowerCase().trim();
        const selectedModule = this.module.toLowerCase().trim();

        // Translate category name if needed
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

  clearFilters() {
    this.keyword = '';
    this.version = '';
    this.category = '';
    this.module = '';
    this.results = [];
    this.hasSearched = false;
  }
}
