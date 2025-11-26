import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiWidgetComponent } from './ai-widget/ai-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AiWidgetComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ckh');
}
