import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CounterService } from 'src/counter/counter.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CounterService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async createGoal(counterId: string, createGoalDto: CreateGoalDto) {
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

  async getGoals(counterId: string, type: string) {
    const goals = await this.goal.findMany({
      where: {
        counterId,
        achieved: type === 'achieved',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return goals;
  }

  async getGoal(goalId: string) {
    const goal = await this.goal.findFirst({
      where: {
        id: goalId,
      },
    });

    return goal;
  }

  async updateGoal(goalId: string, updateGoalDto: UpdateGoalDto) {
    const goal = await this.goal.update({
      where: {
        id: goalId,
      },
      data: {
        ...updateGoalDto,
      },
    });

    return goal;
  }

  async deleteGoal(goalId: string) {
    await this.goal.delete({
      where: {
        id: goalId,
      },
    });
  }

  async cloneGoal(goalId: string) {
    const goal = await this.getGoal(goalId);

    if (!goal) throw new NotFoundException('Goal don`t found');

    const { description, targetDays, counterId } = goal;

    const clonedGoal = await this.goal.create({
      data: {
        description,
        targetDays,
        achieved: false,
        achievedAt: null,
        counterId,
      },
    });

    return clonedGoal;
  }

  async reactivateGoal(goalId: string) {
    const goal = await this.goal.update({
      where: {
        id: goalId,
      },
      data: {
        achieved: false,
        achievedAt: null,
      },
    });

    return goal;
  }

  async goalExistInCounter(goalId: string, counterId: string) {
    return this.throwErrorIfGoalDoesNotExistInCounter(goalId, counterId);
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
