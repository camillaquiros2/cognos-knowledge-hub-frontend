import {
  Component,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
})
export class AiChatComponent implements AfterViewInit {

  /** Referencia al contenedor del scroll */
  @ViewChild('messagesBox') messagesBox!: ElementRef;

  /** Lista de mensajes */
  messages: { sender: 'user' | 'bot', text: string }[] = [];

  /** Entrada del usuario */
  userMessage = '';

  /** Estado para mostrar loading */
  loading = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  /** Scroll automático */
  scrollToBottom() {
    try {
      setTimeout(() => {
        const el = this.messagesBox.nativeElement;
        el.scrollTop = el.scrollHeight;
      }, 50);
    } catch {}
  }

  /** Enviar mensaje */
  sendMessage() {
    if (!this.userMessage.trim()) return;

    const msg = this.userMessage.trim();

    // Agregar mensaje del usuario
    this.messages.push({ sender: 'user', text: msg });
    this.userMessage = '';
    this.loading = true;
    this.scrollToBottom();

    // Llamada al backend local
    this.http.post<{ reply: string }>('http://localhost:3000/ai/query', { message: msg })
      .subscribe({
        next: (res) => {
          this.messages.push({ sender: 'bot', text: res.reply });
          this.loading = false;
          this.scrollToBottom();
        },
        error: () => {
          this.messages.push({
            sender: 'bot',
            text: '❗ Error connecting to AI.'
          });
          this.loading = false;
          this.scrollToBottom();
        }
      });
  }
}
