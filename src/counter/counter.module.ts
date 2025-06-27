import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TeamModule } from 'src/team/team.module';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';

@Module({
  controllers: [CounterController],
  providers: [CounterService],
  imports: [AuthModule, TeamModule],
})
export class CounterModule {}
