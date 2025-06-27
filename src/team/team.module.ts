import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports: [AuthModule],
  exports: [TeamService],
})
export class TeamModule {}
