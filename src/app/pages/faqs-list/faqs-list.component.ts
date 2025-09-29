import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FaqService, Faq } from '../../core/services/faq.service';

@Component({
  selector: 'app-faqs-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs-list.html',
  styleUrls: ['./faqs-list.scss'],
})
export class FaqsListComponent {
  private api = inject(FaqService);
  private route = inject(ActivatedRoute);

  items: Faq[] = [];

  ngOnInit() {
    const articleId = Number(this.route.snapshot.queryParamMap.get('article_id'));
    const obs = articleId ? this.api.listByArticle(articleId) : this.api.listAll();
    obs.subscribe(d => this.items = d);
  }
}
