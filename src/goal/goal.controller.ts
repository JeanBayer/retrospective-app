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
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalService } from './goal.service';

@Controller('teams/:teamId/counters/:counterId/goals')
@UseGuards(AuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post('')
  createGoal(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() createGoalDto: CreateGoalDto,
    @User() user: CurrentUser,
  ) {
    return this.goalService.createGoal(
      user.id,
      teamId,
      counterId,
      createGoalDto,
    );
  }

  @Get('')
  getGoals(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @User() user: CurrentUser,
  ) {
    return this.goalService.getGoals(user.id, teamId, counterId);
  }

  @Get('/:goalId')
  getGoal(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @User() user: CurrentUser,
  ) {
    return this.goalService.getGoal(user.id, teamId, counterId, goalId);
  }
}
