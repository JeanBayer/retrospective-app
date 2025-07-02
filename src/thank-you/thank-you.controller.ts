import { Controller, UseGuards } from '@nestjs/common';
import { ThankYouService } from './thank-you.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('teams/:teamId/retrospectives/:retroId/thank-you')
@UseGuards(AuthGuard)
export class ThankYouController {
  constructor(private readonly thankYouService: ThankYouService) {}
}
