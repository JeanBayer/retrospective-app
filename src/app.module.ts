import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [AuthModule, TeamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
