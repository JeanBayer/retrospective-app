import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TeamModule } from 'src/team/team.module';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService],
  imports: [AuthModule, forwardRef(() => TeamModule)],
  exports: [MembershipService],
})
export class MembershipModule {}
