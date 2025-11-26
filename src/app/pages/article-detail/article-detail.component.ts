import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService, Article, Tag } from '../../core/services/article.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent {

  private api = inject(ArticleService);
  private route = inject(ActivatedRoute);

  item?: Article;
  tags: Tag[] = [];
  loading = true;
  currentYear = new Date().getFullYear();
  showToast = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar artículo
    this.api.get(id).subscribe({
      next: (data) => {
        this.item = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    // Cargar tags
    this.api.getTags(id).subscribe({
      next: (ts) => {
        this.tags = ts;
      },
      error: () => {
        this.tags = [];
      }
    });
  }

  async exportToPDF() {
    const content = document.querySelector('.article-card') as HTMLElement;
    if (!content) return;

    const pdf = new jsPDF('p', 'mm', 'a4');

    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${this.item?.title || 'article'}.pdf`);

    // Mostrar toast
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2500);
  }
}
