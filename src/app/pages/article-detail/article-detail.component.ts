import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService, Article, Tag } from '../../core/services/article.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="container" *ngIf="item">
      <a routerLink="/articles">← Volver</a>
      <h2>{{ item.title }}</h2>

      <p><strong>Versión:</strong> {{ item.version || '—' }}</p>
      <p>
        <strong>Categoría:</strong> {{ item.category || '—' }}
        <span *ngIf="item.module"> · <strong>Módulo:</strong> {{ item.module }}</span>
      </p>

      <p>{{ item.summary }}</p>
      <p><a [href]="item.source_url" target="_blank">Fuente</a></p>

      <div *ngIf="tags?.length">
        <strong>Tags:</strong>
        <span *ngFor="let t of tags; let last = last">
          {{ t.name }}<span *ngIf="!last">, </span>
        </span>
      </div>

      <p class="mt">
        <a [routerLink]="['/faqs']" [queryParams]="{ article_id: item.id }">
          Ver FAQs de este artículo
        </a>
      </p>
    </section>
  `
})
export class ArticleDetailComponent {
  private api = inject(ArticleService);
  private route = inject(ActivatedRoute);
  item?: Article;
  tags: Tag[] = [];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.get(id).subscribe(d => this.item = d);
    this.api.getTags(id).subscribe(ts => this.tags = ts);
  }
}
