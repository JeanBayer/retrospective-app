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
import { CounterExistInTeam } from 'src/counter/guards/counter-exist-in-team.guard';
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalService } from './goal.service';
import { GoalExistInCounter } from './guards/goal-exist-in-counter.guard';

@Controller('teams/:teamId/counters/:counterId/goals')
@UseGuards(AuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post('')
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  createGoal(
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalService.createGoal(counterId, createGoalDto);
  }

  @Get('')
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  getGoals(@Param('counterId', ParseUUIDPipe) counterId: string) {
    return this.goalService.getGoals(counterId);
  }

  @Get('/:goalId')
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  @UseGuards(GoalExistInCounter)
  getGoal(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.goalService.getGoal(goalId);
  }
}
