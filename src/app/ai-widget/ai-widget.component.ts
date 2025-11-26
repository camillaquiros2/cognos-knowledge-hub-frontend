import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiChatComponent } from '../pages/ai-chat/ai-chat.component';

@Component({
  selector: 'app-ai-widget',
  standalone: true,
  imports: [CommonModule, AiChatComponent],
  templateUrl: './ai-widget.component.html',
  styleUrls: ['./ai-widget.component.scss'],
})
export class AiWidgetComponent {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
