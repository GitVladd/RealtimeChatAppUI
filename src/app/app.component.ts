import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './components/chat/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chat-app';
  userName: string = ''; 
  isLoggedIn: boolean = false;
  errorMessage: string = '';

  constructor() {}

  login(): void {
    if (this.userName.trim()) {
      this.isLoggedIn = true;
      this.errorMessage = '';
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userName = '';
    this.errorMessage = '';
  }

  handleConnectionError(error: string): void {
    this.isLoggedIn = false;
    this.errorMessage = error;
  }
}