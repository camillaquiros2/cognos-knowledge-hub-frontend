import { Routes } from '@angular/router';
import { ArticlesListComponent } from './pages/articles-list/articles-list.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleCreateComponent } from './pages/article-create/article-create.component';
import { FaqsListComponent } from './pages/faqs-list/faqs-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'articles' },
  { path: 'articles', component: ArticlesListComponent },
  { path: 'articles/new', component: ArticleCreateComponent },
  { path: 'articles/:id', component: ArticleDetailComponent },
  { path: 'faqs', component: FaqsListComponent },
  { path: '**', redirectTo: 'articles' }
];
