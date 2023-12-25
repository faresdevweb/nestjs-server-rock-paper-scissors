import { Injectable } from '@nestjs/common';
import * as shortId from 'shortid';

@Injectable()
export class RoomService {
  private rooms = [];

  createRoom(payload: any): string {
    let room;
    if (payload.type === 'stranger') {
      const index = this.rooms.findIndex(
        (room) => room.vacant === true && room.private === false,
      );
      if (index >= 0) {
        room = this.rooms[index];
        room.players[payload.playerId] = this.createPlayer();
        room.vacant = false;
      } else {
        room = this.createRoomObject(payload, false);
        this.rooms.push(room);
      }
    } else {
      room = this.createRoomObject(payload, true);
      this.rooms.push(room);
    }
    return room.roomId;
  }

  joinRoom(playerId: string, roomId: string): any {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (room && room.vacant && room.private) {
      room.players[playerId] = this.createPlayer();
      room.vacant = false;
      return room;
    }
    return null;
  }

  updateRoom(roomId: string, updateData: any): void {
    const index = this.rooms.findIndex((room) => room.roomId === roomId);
    if (index >= 0) {
      this.rooms[index] = { ...this.rooms[index], ...updateData };
    }
  }

  private createRoomObject(payload: any, isPrivate: boolean): any {
    return {
      roomId: shortId.generate(),
      players: { [payload.playerId]: this.createPlayer() },
      vacant: true,
      private: isPrivate,
      type: payload.type,
    };
  }

  private createPlayer(): any {
    return { option: null, optionLock: false, score: 0 };
  }
}
