import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AiWidgetComponent } from './ai-widget/ai-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,      // Necesario para <router-outlet>
    RouterLink,        // 🔥 NECESARIO para routerLink en el logo
    AiWidgetComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ckh');
}
