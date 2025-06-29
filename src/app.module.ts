import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { CounterModule } from './counter/counter.module';
import { GoalModule } from './goal/goal.module';
import { MembershipModule } from './membership/membership.module';
import { RetrospectiveModule } from './retrospective/retrospective.module';
import { SprintWinnerModule } from './sprint-winner/sprint-winner.module';

@Module({
  imports: [AuthModule, TeamModule, CounterModule, GoalModule, MembershipModule, RetrospectiveModule, SprintWinnerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
