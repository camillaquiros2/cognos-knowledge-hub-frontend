import { Routes } from '@angular/router';
import { ArticlesListComponent } from './pages/articles-list/articles-list.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { FaqsListComponent } from './pages/faqs-list/faqs-list.component';
import { ArticlesSearchComponent } from './pages/articles-search/articles-search.component';

export const routes: Routes = [
  { path: '', component: ArticlesSearchComponent }, 
  { path: 'articles', component: ArticlesListComponent },
  { path: 'articles/:id', component: ArticleDetailComponent },
  { path: 'faqs', component: FaqsListComponent },
  { path: '**', redirectTo: '' }
];
