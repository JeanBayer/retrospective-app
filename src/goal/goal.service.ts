import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CounterService } from 'src/counter/counter.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CounterService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async createGoal(
    teamId: string,
    counterId: string,
    createGoalDto: CreateGoalDto,
  ) {
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const { description, targetDays } = createGoalDto;

    const goal = await this.goal.create({
      data: {
        description,
        targetDays,
        counterId,
      },
    });

    return goal;
  }

  async getGoals(teamId: string, counterId: string) {
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const goals = await this.goal.findMany({
      where: {
        counterId,
      },
    });

    return goals;
  }

  async getGoal(teamId: string, counterId: string, goalId: string) {
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);
    await this.throwErrorIfGoalDoesNotExistInCounter(goalId, counterId);

    const goal = await this.goal.findFirst({
      where: {
        id: goalId,
      },
    });

    return goal;
  }

  private async throwErrorIfCounterDoesNotExistInTeam(
    teamId: string,
    counterId: string,
  ) {
    const counter = await this.counter.count({
      where: {
        id: counterId,
        teamId,
      },
    });

    if (!counter) throw new NotFoundException('Counter don`t found');
  }

  private async throwErrorIfGoalDoesNotExistInCounter(
    goalId: string,
    counterId: string,
  ) {
    const goal = await this.goal.count({
      where: {
        id: goalId,
        counterId,
      },
    });

    if (!goal) throw new NotFoundException('Goal don`t found');
  }
}
