import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CounterModule } from 'src/counter/counter.module';
import { MembershipModule } from 'src/membership/membership.module';
import { TeamModule } from 'src/team/team.module';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
  controllers: [GoalController],
  providers: [GoalService],
  imports: [AuthModule, TeamModule, MembershipModule, CounterModule],
})
export class GoalModule {}
