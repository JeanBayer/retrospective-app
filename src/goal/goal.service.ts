import {
  ConflictException,
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
    userId: string,
    teamId: string,
    counterId: string,
    createGoalDto: CreateGoalDto,
  ) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
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

  async getGoals(userId: string, teamId: string, counterId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const goals = await this.goal.findMany({
      where: {
        counterId,
      },
    });

    return goals;
  }

  async getGoal(
    userId: string,
    teamId: string,
    counterId: string,
    goalId: string,
  ) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);
    await this.throwErrorIfGoalDoesNotExistInCounter(goalId, counterId);

    const goal = await this.goal.findFirst({
      where: {
        id: goalId,
      },
    });

    return goal;
  }

  private async throwErrorIfUserDoesNotExistInTeam(
    userId: string,
    teamId: string,
  ) {
    const userAlreadyInTeam = await this.teamMembership.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (!userAlreadyInTeam)
      throw new ConflictException('User is not already a member of this team');

    return userAlreadyInTeam;
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
