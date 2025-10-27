import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService, Article } from '../../core/services/article.service';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent {
  private api = inject(ArticleService);

  articles: Article[] = [];
  filteredArticles: Article[] = [];
  filterText = '';

  ngOnInit() {
    this.api.list().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data;
      },
      error: (err) => console.error('Error fetching articles', err)
    });
  }

  filterArticles() {
    const text = this.filterText.toLowerCase();
    this.filteredArticles = this.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(text) ||
        a.summary.toLowerCase().includes(text)
    );
  }
}
