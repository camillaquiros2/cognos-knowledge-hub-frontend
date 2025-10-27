import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }
}
