import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section class="container">
      <a routerLink="/articles">← Volver</a>
      <h2>Crear artículo</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Título
          <input formControlName="title" />
        </label>
        <label>Resumen
          <textarea formControlName="summary"></textarea>
        </label>
        <label>Fuente (URL)
          <input formControlName="source_url" />
        </label>
        <label>Versión (opcional)
          <input type="number" formControlName="version_id" />
        </label>
        <button type="submit" [disabled]="form.invalid">Guardar</button>
      </form>
    </section>
  `
})
export class ArticleCreateComponent {
  private fb = inject(FormBuilder);
  private api = inject(ArticleService);
  private router = inject(Router);

  form = this.fb.group({
    title: ['', [Validators.required]],
    summary: ['', [Validators.required]],
    source_url: ['', [Validators.required]],
    version_id: this.fb.control<number | null>(null)
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.api.create(this.form.value as any).subscribe(a => {
      this.router.navigate(['/articles', a.id]);
    });
  }
}
