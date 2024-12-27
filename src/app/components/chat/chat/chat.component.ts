import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../../../services/chat/chat.service';
import { ChatMessageCreateDto } from '../../../models/chat-message-create-dto';
import { ChatMessageGetDto } from '../../../models/chat-message-get-dto';
import { Subscription } from 'rxjs';
import { PaginationParameter } from '../../../models/pagination-parameter';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() userName: string = '';
  @Output() connectionError = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  messages: ChatMessageGetDto[] = [];
  newMessage: string = '';
  subscription!: Subscription;
  pagination: PaginationParameter = { pageNumber: 1, pageSize: 100 };

  constructor(private chatService: ChatService) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.chatService.initializeConnection();
      this.loadMessages();
      this.subscription = this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
      });
    } catch (error) {
      this.connectionError.emit('Failed to connect to chat server. Please try again.');
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadMessages() {
    this.chatService.getMessages(this.pagination).subscribe({
      next: (messages: ChatMessageGetDto[]) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  getSentimentClass(message: ChatMessageGetDto): string {
    return message.sentimentAnalysis?.sentiment?.toLowerCase() || 'neutral';
  }

  sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }

    const message: ChatMessageCreateDto = {
      user: this.userName,
      message: this.newMessage,
    };

    this.chatService.sendMessage(message).subscribe(
      () => {
        this.newMessage = '';
      },
      (err) => {
        console.error('Error sending message: ', err);
      }
    );
  }
}