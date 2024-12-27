import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,  BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatMessageGetDto } from '../../models/chat-message-get-dto';
import { ChatMessageCreateDto } from '../../models/chat-message-create-dto';
import { PaginationParameter } from '../../models/pagination-parameter';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/chatmessages`;
  private hubUrl = `${environment.apiUrl}/chathub`;
  
  private hubConnection: HubConnection | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessageGetDto[]>([]); 
  messages$ = this.messagesSubject.asObservable();
  
  private connectionPromise: Promise<void> | null = null;

  constructor(
    private http: HttpClient
  ) {
    this.initializeConnection();
  }

  public async initializeConnection(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .build();

      this.hubConnection?.on('ReceiveMessage', (message: ChatMessageGetDto) => {
        this.addMessage(message);
      });

      this.hubConnection
        ?.start()
        .then(() => {
          console.log('Connected to SignalR hub');
          resolve();
        })
        .catch((err) => {
          console.error('SignalR connection error: ', err);
          reject(new Error('Failed to connect to chat service'));
        });
    });

    return this.connectionPromise;
  }

  public sendMessage(message: ChatMessageCreateDto): Observable<any> {
    return new Observable((observer) => {
      if (!this.hubConnection) {
        observer.error('No hub connection');
        return;
      }
      
      this.hubConnection
        .invoke('SendMessage', message)
        .then(() => observer.next())
        .catch((err) => observer.error(err));
    });
  }

  public getMessages(
    pagination: PaginationParameter = { pageNumber: 1, pageSize: 100 }
  ): Observable<ChatMessageGetDto[]> {
    const params = new HttpParams()
      .set('pageNumber', pagination.pageNumber.toString())
      .set('pageSize', pagination.pageSize.toString());
  
    return this.http.get<ChatMessageGetDto[]>(this.apiUrl, { params }).pipe(
      tap((messages) => {
        this.messagesSubject.next(messages);
      })
    );
  }

  private addMessage(message: ChatMessageGetDto) {
    const currentMessages = this.messagesSubject.getValue();
    const updatedMessages = [message, ...currentMessages];
    this.messagesSubject.next(updatedMessages);
  }
}