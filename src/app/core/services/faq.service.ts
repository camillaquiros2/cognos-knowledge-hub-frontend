import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Faq {
  id: number;
  question: string;
  answer: string;
  article_id?: number | null;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);
  listAll(): Observable<Faq[]> {
    return this.http.get<Faq[]>('/api/faqs');
  }
  listByArticle(articleId: number): Observable<Faq[]> {
    return this.http.get<Faq[]>(`/api/faqs`, { params: { article_id: articleId } as any });
  }
}
