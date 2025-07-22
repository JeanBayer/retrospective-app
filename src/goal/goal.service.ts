import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CounterService } from 'src/counter/counter.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CounterService.name);

  constructor(private readonly websocketGateway: WebsocketGateway) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async createGoal(
    teamId: string,
    counterId: string,
    createGoalDto: CreateGoalDto,
  ) {
    const { description, targetDays } = createGoalDto;

    const goal = await this.goal.create({
      data: {
        description,
        targetDays,
        counterId,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'COUNTER', counterId, 'GOALS'],
      data: {},
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
        createdAt: 'asc',
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

  async updateGoal(
    teamId: string,
    goalId: string,
    updateGoalDto: UpdateGoalDto,
  ) {
    const goal = await this.goal.update({
      where: {
        id: goalId,
      },
      data: {
        ...updateGoalDto,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'COUNTER', goal.counterId, 'GOALS'],
      data: {},
    });

    return goal;
  }

  async deleteGoal(teamId: string, goalId: string) {
    const goal = await this.goal.delete({
      where: {
        id: goalId,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'COUNTER', goal.counterId, 'GOALS'],
      data: {},
    });
  }

  async cloneGoal(teamId: string, goalId: string) {
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

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'COUNTER', goal.counterId, 'GOALS'],
      data: {},
    });

    return clonedGoal;
  }

  async reactivateGoal(teamId: string, goalId: string) {
    const goal = await this.goal.update({
      where: {
        id: goalId,
      },
      data: {
        achieved: false,
        achievedAt: null,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'COUNTER', goal.counterId, 'GOALS'],
      data: {},
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
