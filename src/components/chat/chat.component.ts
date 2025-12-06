import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: Array<{text: string; sender: 'bot' | 'user'; time: Date}> = [
    { text: '¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?', sender: 'bot', time: new Date() }
  ];

  input = '';

  sendMessage(): void {
    const text = this.input?.trim();
    if (!text) return;
    this.messages.push({ text, sender: 'user', time: new Date() });
    this.input = '';
    this.scrollToBottom();
    setTimeout(() => {
      const reply = this.generateReply(text);
      this.messages.push({ text: reply, sender: 'bot', time: new Date() });
      this.scrollToBottom();
    }, 700);
  }

  generateReply(userText: string): string {
    const t = userText.toLowerCase();
    if (/dolor|fiebre|tos|mareo|náusea|vomito|náuseas|headache|dolor de cabeza/.test(t)) {
      return 'Siento que no te encuentres bien. ¿Desde cuándo tienes esos síntomas?';
    }
    if (/hola|buenos|buenas|buen día|buenas tardes/.test(t)) {
      return '¡Hola! Cuéntame tus dudas y trataré de ayudarte.';
    }
    return 'Gracias por contarme. ¿Puedes dar más detalles sobre los síntomas o la duración?';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.chat-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
