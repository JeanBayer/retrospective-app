import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipModule } from 'src/membership/membership.module';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';

@Module({
  controllers: [TimerController],
  providers: [TimerService],
  imports: [AuthModule, MembershipModule],
})
export class TimerModule {}
