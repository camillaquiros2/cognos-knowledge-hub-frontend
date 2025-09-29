import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService, Article } from '../../core/services/article.service';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container">
      <h1>Artículos</h1>
      <a routerLink="/articles/new">+ Crear artículo</a>
      <ul *ngIf="items?.length; else empty">
        <li *ngFor="let a of items">
          <a [routerLink]="['/articles', a.id]">{{ a.title }}</a>
          <p>{{ a.summary }}</p>
        </li>
      </ul>
      <ng-template #empty><p>No hay artículos.</p></ng-template>
    </section>
  `
})
export class ArticlesListComponent {
  private api = inject(ArticleService);
  items: Article[] = [];
  ngOnInit() { this.api.list().subscribe(d => this.items = d); }
}
