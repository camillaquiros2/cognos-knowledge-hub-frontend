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
  private base = 'http://localhost:3000/api';

  listAll(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.base}/faqs`);
  }

  listByArticle(articleId: number): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.base}/faqs`, {
      params: { article_id: articleId } as any,
    });
  }
}
