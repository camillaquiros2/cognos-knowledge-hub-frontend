import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category { id: number; name: string; description?: string | null; }

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  list(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }
}
