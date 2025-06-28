import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipModule } from 'src/membership/membership.module';
import { TeamModule } from 'src/team/team.module';
import { RetrospectiveController } from './retrospective.controller';
import { RetrospectiveService } from './retrospective.service';

@Module({
  controllers: [RetrospectiveController],
  providers: [RetrospectiveService],
  imports: [AuthModule, TeamModule, MembershipModule],
  exports: [RetrospectiveService],
})
export class RetrospectiveModule {}
