import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OpenAIService } from '../services/OpenAIService';
import { IApiIA } from '../services/IApiIA';
import 'dotenv/config';
import { KoboldCppApi } from '../services/KoboldCppApi';

export interface IClient {
  id: string;
  username: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  clientList: IClient[] = [];

  apiIA: IApiIA;

  messages: any[] = [];

  messagesSelected: any[] = [];

  constructor() {
    this.apiIA =
      process.env.OPEN_API_KEY != '' ? new OpenAIService() : new KoboldCppApi();
  }

  @SubscribeMessage('chat-message')
  handleMessage(client: any, payload: any): void {
    this.messages.push(payload);
    this.server.emit('chat-message', payload);
  }

  @SubscribeMessage('chat-messages')
  handleMessages(): void {
    this.server.emit('chat-messages', this.messages);
  }

  @SubscribeMessage('chat-check_username')
  handleCheckUsername(client: any, payload: any): void {
    this.server.to(client.id).emit('chat-check_username', {
      isUsed:
        this.clientList.findIndex((c) => c.username === payload.username) !==
        -1,
    });
  }

  @SubscribeMessage('chat-username')
  handleUsername(client: any, payload: any): void {
    if (
      this.clientList.findIndex((c) => c.username === payload.username) !== -1
    ) {
      this.server.to(client.id).emit('chat-username', {
        error: 'The username is already in use',
      });
    } else {
      const cClient = this.clientList.find((c) => c.id === client.id);
      cClient.username = payload.username;
    }
  }

  @SubscribeMessage('chat-traduction')
  handleTraduction(client: any, payload: any): void {
    this.apiIA.translate(payload.msg, payload.language).then((msg) => {
      this.server.to(client.id).emit('chat-traduction', {
        msg,
        id: payload.id,
      });
    });
  }

  @SubscribeMessage('chat-suggestions')
  handleSuggestions(client: any, payload: any): void {
    this.apiIA.suggestions(payload.msg, payload.language).then((msg) => {
      this.server.to(client.id).emit('chat-suggestions', {
        msg,
      });
    });
  }

  @SubscribeMessage('chat-select-message')
  handleMessageSelection(client: any, payload): void {
    if (payload.isSelected) {
      this.messagesSelected.push({ id: payload.id, content: payload.msg });
    } else {
      this.messagesSelected.splice(
        this.messagesSelected.findIndex((m) => m.id === payload.id),
        1,
      );
    }
  }

  @SubscribeMessage('chat-verify')
  handleVerify(client: any): void {
    if (this.messagesSelected.length !== 0) {
      this.apiIA.verify(this.messagesSelected).then((responses) => {
        this.server.to(client.id).emit('chat-verified', {
          responses,
        });
      });
    }
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('client connected', client.id);
    this.clientList.push({
      id: client.id,
      username: '',
    });
  }

  handleDisconnect(client: any): any {
    console.log('client disconnected', client.id);
    this.clientList.splice(
      this.clientList.findIndex((c) => c.id === client.id),
      1,
    );
  }

  @SubscribeMessage('chat-disconnect-all')
  handleDisconnectAll(): void {
    this.messages = [];
    this.clientList.forEach((c) => this.handleDisconnect(c));
  }
}
