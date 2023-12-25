import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private roomService: RoomService) {}

  handleConnection(client: Socket) {
    console.log('connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected', client.id);
  }

  @SubscribeMessage('room:create')
  handleRoomCreate(client: Socket, payload: any) {
    const roomId = this.roomService.createRoom({
      ...payload,
      playerId: client.id,
    });
    client.join(roomId);
    this.server.to(roomId).emit('room:created', { roomId });
  }

  @SubscribeMessage('room:join')
  handleRoomJoin(client: Socket, payload: any) {
    const room = this.roomService.joinRoom(client.id, payload.roomId);
    if (room) {
      client.join(room.roomId);
      this.server.to(room.roomId).emit('room:joined', room);
    } else {
      client.emit('room:joinError', { error: 'Unable to join room' });
    }
  }

  @SubscribeMessage('room:update')
  handleRoomUpdate(client: Socket, payload: any) {
    this.roomService.updateRoom(payload.roomId, payload);
    this.server.to(payload.roomId).emit('room:updated', payload);
  }
}
