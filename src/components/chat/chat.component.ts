import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatGptService } from '../../services/chatgpt.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  private readonly chatGptService = inject(ChatGptService);

  messages: Array<{text: string; sender: 'bot' | 'user'; time: Date}> = [
    { text: '¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?', sender: 'bot', time: new Date() }
  ];

  input = '';
  isLoading = false;
  errorMessage = '';

  sendMessage(): void {
    const text = this.input?.trim();
    if (!text || this.isLoading) return;

    // Agregar mensaje del usuario
    this.messages.push({ text, sender: 'user', time: new Date() });
    this.input = '';
    this.errorMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    // Enviar mensaje a ChatGPT
    this.chatGptService.sendMessage({
      message: text,
      model: 'gpt-3.5-turbo',
      temperature: 0.7
    }).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.response,
          sender: 'bot',
          time: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al enviar el mensaje. Inténtalo de nuevo.';
        this.isLoading = false;
        // Opcional: agregar un mensaje de error al chat
        this.messages.push({
          text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
          sender: 'bot',
          time: new Date()
        });
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.chat-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
