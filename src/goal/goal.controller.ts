import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CounterExistInTeam } from 'src/counter/guards/counter-exist-in-team.guard';
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { AdminGuard } from 'src/team/guards/admin.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalService } from './goal.service';
import { GoalExistInCounter } from './guards/goal-exist-in-counter.guard';

@Controller('teams/:teamId/counters/:counterId/goals')
@UseGuards(AuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post('')
  @UseGuards(UserExistInTeam, CounterExistInTeam)
  createGoal(
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalService.createGoal(counterId, createGoalDto);
  }

  @Get('')
  @UseGuards(UserExistInTeam, CounterExistInTeam)
  getGoals(
    @Query('type') type: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
  ) {
    return this.goalService.getGoals(counterId, type);
  }

  @Get('/:goalId')
  @UseGuards(UserExistInTeam, CounterExistInTeam, GoalExistInCounter)
  getGoal(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.goalService.getGoal(goalId);
  }

  @Patch('/:goalId')
  @UseGuards(AdminGuard, CounterExistInTeam, GoalExistInCounter)
  updateGoal(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalService.updateGoal(goalId, updateGoalDto);
  }

  @Delete('/:goalId')
  @UseGuards(AdminGuard, CounterExistInTeam, GoalExistInCounter)
  deleteGoal(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.goalService.deleteGoal(goalId);
  }

  @Post('/:goalId/clone')
  @UseGuards(UserExistInTeam, CounterExistInTeam, GoalExistInCounter)
  cloneGoal(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.goalService.cloneGoal(goalId);
  }

  @Post('/:goalId/reactivate')
  @UseGuards(AdminGuard, CounterExistInTeam, GoalExistInCounter)
  reactivateGoal(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.goalService.reactivateGoal(goalId);
  }
}
