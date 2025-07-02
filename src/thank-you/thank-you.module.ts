import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipModule } from 'src/membership/membership.module';
import { RetrospectiveModule } from 'src/retrospective/retrospective.module';
import { TeamModule } from 'src/team/team.module';
import { ThankYouController } from './thank-you.controller';
import { ThankYouService } from './thank-you.service';

@Module({
  controllers: [ThankYouController],
  providers: [ThankYouService],
  imports: [AuthModule, TeamModule, MembershipModule, RetrospectiveModule],
  exports: [ThankYouService],
})
export class ThankYouModule {}
