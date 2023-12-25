import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { RoomModule } from './room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [],
  providers: [GameGateway],
})
export class AppModule {}
