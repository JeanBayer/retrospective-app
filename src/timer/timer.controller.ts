import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { CreateTimerDto } from './dto/create-timer.dto';
import { TimerService } from './timer.service';

@Controller('teams/:teamId/timers')
@UseGuards(AuthGuard)
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post('')
  @UseGuards(UserExistInTeam)
  createTimer(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() createTimerDto: CreateTimerDto,
  ) {
    return this.timerService.createTimer(teamId, createTimerDto);
  }

  @Get('')
  @UseGuards(UserExistInTeam)
  getTimer(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.timerService.getTimer(teamId);
  }
}
