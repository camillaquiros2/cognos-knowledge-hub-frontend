import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  id: number;
  title: string;
  summary: string;
  source_url: string;
  updated_at?: string;
  version?: string | null;
  category?: string | null;
  module?: string | null;
  category_id?: number | null;
  module_id?: number | null;
  version_id?: number | null;
}

export interface CreateArticleDto {
  title: string;
  summary: string;
  source_url: string;
  version_id?: number | null;
  category_id?: number | null;
  module_id?: number | null;
  status?: 'draft' | 'published';
}

export interface Tag {
  id: number;
  name: string;
}

export interface Version {
  id: number;
  label: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ModuleItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';

  /* -------------------------------------------------------
     📌 CRUD BÁSICO
     ------------------------------------------------------- */
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

  /* -------------------------------------------------------
     ⭐ TAGS (para article-detail)
     ------------------------------------------------------- */
  getTags(articleId: number): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.base}/articles/${articleId}/tags`);
  }

  /* -------------------------------------------------------
     🔎 SEARCH REAL (CORREGIDO)
     ------------------------------------------------------- */
  searchArticles(filters: {
    keyword: string;
    version: string;
    category: string;
    module: string;
  }): Observable<Article[]> {
    
    let params = new HttpParams();

    // Keyword
    if (filters.keyword?.trim()) {
      params = params.set('keyword', filters.keyword.trim());
    }

    // Version
    if (filters.version && filters.version !== 'All') {
      params = params.set('version', filters.version);
    }

    // Category
    if (filters.category && filters.category !== 'All') {
      params = params.set('category', filters.category);
    }

    // Module
    if (filters.module && filters.module !== 'All') {
      params = params.set('module', filters.module);
    }

    return this.http.get<Article[]>(`${this.base}/articles/search`, { params });
  }

  /* -------------------------------------------------------
     ⭐ NUEVO: filtros dinámicos (usa tu backend real)
     ------------------------------------------------------- */

  getVersions(): Observable<Version[]> {
    return this.http.get<Version[]>(`${this.base}/versions`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  getModules(): Observable<ModuleItem[]> {
    return this.http.get<ModuleItem[]>(`${this.base}/modules`);
  }
}
