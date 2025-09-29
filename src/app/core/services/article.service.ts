import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  summary: string;
  source_url: string;
  updated_at?: string;
  version?: string | null;
  category_id?: number | null;
  category?: string | null;
  module_id?: number | null;
  module?: string | null;
}
export interface Tag { id: number; name: string; }

export interface CreateArticleDto {
  title: string;
  summary: string;
  source_url: string;
  version_id?: number | null;
  status?: 'draft' | 'published';
  category_id?: number | null;
  module_id?: number | null;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private http = inject(HttpClient);
  private base = '/api';

  list(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.base}/articles`);
  }
  get(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.base}/articles/${id}`);
  }
  create(body: CreateArticleDto): Observable<Article> {
    return this.http.post<Article>(`${this.base}/articles`, body);
  }
  update(id: number, body: Partial<CreateArticleDto>): Observable<Article> {
    return this.http.put<Article>(`${this.base}/articles/${id}`, body);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/articles/${id}`);
  }

  getTags(id: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.base}/articles/${id}/tags`);
  }
}
