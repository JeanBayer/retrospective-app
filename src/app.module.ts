import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [AuthModule, TeamModule, CounterModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
