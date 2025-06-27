import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateCounterDto } from './dto/create-counter.dto';

@Injectable()
export class CounterService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CounterService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async createCounter(
    userId: string,
    teamId: string,
    createCounterDto: CreateCounterDto,
  ) {
    const { name, incrementButtonLabel, resetButtonLabel } = createCounterDto;
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

    const counter = await this.counter.create({
      data: {
        teamId,
        name,
        incrementButtonLabel,
        resetButtonLabel,
      },
    });

    return counter;
  }

  async getCounters(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

    const counters = await this.counter.findMany({
      where: {
        teamId,
      },
    });

    return counters;
  }

  async getCounter(userId: string, teamId: string, counterId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const alreadyIncrementedToday =
      await this.hasCounterBeenIncrementedToday(counterId);

    const counter = await this.counter.findFirst({
      where: {
        id: counterId,
        teamId,
      },
    });

    if (!counter) throw new NotFoundException('Counter don`t found');

    return { ...counter, alreadyIncrementedToday };
  }

  async incrementCounter(userId: string, teamId: string, counterId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const alreadyIncrementedToday =
      await this.hasCounterBeenIncrementedToday(counterId);

    if (alreadyIncrementedToday)
      throw new ConflictException(
        'The counter has already been incremented today',
      );

    const [counter] = await this.$transaction([
      this.counter.update({
        where: { id: counterId, teamId },
        data: { currentCount: { increment: 1 } },
      }),
      this.counterIncrementRecord.create({
        data: {
          counterId,
          incrementedAt: this.getToday(),
        },
      }),
    ]);

    return counter;
  }

  private getToday() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return today;
  }

  private async hasCounterBeenIncrementedToday(counterId: string) {
    const alreadyIncremented = await this.counterIncrementRecord.count({
      where: {
        counterId,
        incrementedAt: this.getToday(),
      },
    });

    return alreadyIncremented > 0;
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
}
