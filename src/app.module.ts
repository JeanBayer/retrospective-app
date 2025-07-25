import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CounterModule } from './counter/counter.module';
import { GoalModule } from './goal/goal.module';
import { MembershipModule } from './membership/membership.module';
import { RetrospectiveModule } from './retrospective/retrospective.module';
import { SprintWinnerModule } from './sprint-winner/sprint-winner.module';
import { TeamModule } from './team/team.module';
import { ThankYouModule } from './thank-you/thank-you.module';
import { UserModule } from './user/user.module';
import { WebsocketModule } from './websocket/websocket.module';
import { TimerModule } from './timer/timer.module';

@Module({
  imports: [
    AuthModule,
    TeamModule,
    CounterModule,
    GoalModule,
    MembershipModule,
    RetrospectiveModule,
    SprintWinnerModule,
    ThankYouModule,
    UserModule,
    WebsocketModule,
    TimerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
