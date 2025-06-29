import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipModule } from 'src/membership/membership.module';
import { RetrospectiveModule } from 'src/retrospective/retrospective.module';
import { TeamModule } from 'src/team/team.module';
import { SprintWinnerController } from './sprint-winner.controller';
import { SprintWinnerService } from './sprint-winner.service';

@Module({
  controllers: [SprintWinnerController],
  providers: [SprintWinnerService],
  imports: [AuthModule, TeamModule, MembershipModule, RetrospectiveModule],
  exports: [SprintWinnerService],
})
export class SprintWinnerModule {}
