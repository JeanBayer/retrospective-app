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
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalService } from './goal.service';

@Controller('teams/:teamId/counters/:counterId/goals')
@UseGuards(AuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post('')
  @UseGuards(UserExistInTeam)
  createGoal(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalService.createGoal(teamId, counterId, createGoalDto);
  }

  @Get('')
  @UseGuards(UserExistInTeam)
  getGoals(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
  ) {
    return this.goalService.getGoals(teamId, counterId);
  }

  @Get('/:goalId')
  @UseGuards(UserExistInTeam)
  getGoal(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Param('goalId', ParseUUIDPipe) goalId: string,
  ) {
    return this.goalService.getGoal(teamId, counterId, goalId);
  }
}
