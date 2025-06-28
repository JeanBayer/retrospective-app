import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateCounterDto } from './dto/create-counter.dto';
import { ResetCounterDto } from './dto/reset-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';

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

    return { ...counter, alreadyModifiedToday: false };
  }

  async updateCounter(
    userId: string,
    teamId: string,
    counterId: string,
    updateCounterDto: UpdateCounterDto,
  ) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);
    const alreadyModifiedToday =
      await this.hasCounterBeenModifiedToday(counterId);

    const counter = await this.counter.update({
      where: {
        id: counterId,
      },
      data: {
        ...updateCounterDto,
      },
    });

    return { ...counter, alreadyModifiedToday };
  }

  async deleteCounter(userId: string, teamId: string, counterId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    await this.counter.delete({
      where: {
        id: counterId,
      },
    });

    return;
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

    const alreadyModifiedToday =
      await this.hasCounterBeenModifiedToday(counterId);

    const counter = await this.counter.findFirst({
      where: {
        id: counterId,
        teamId,
      },
    });

    if (!counter) throw new NotFoundException('Counter don`t found');

    return { ...counter, alreadyModifiedToday };
  }

  async incrementCounter(userId: string, teamId: string, counterId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const alreadyModifiedToday =
      await this.hasCounterBeenModifiedToday(counterId);

    if (alreadyModifiedToday)
      throw new ConflictException(
        'The counter has already been modified today',
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

    return { ...counter, alreadyModifiedToday: true };
  }

  async resetCounter(
    userId: string,
    teamId: string,
    counterId: string,
    resetCounterDto: ResetCounterDto,
  ) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
    await this.throwErrorIfCounterDoesNotExistInTeam(teamId, counterId);

    const alreadyModifiedToday =
      await this.hasCounterBeenModifiedToday(counterId);

    if (alreadyModifiedToday)
      throw new ConflictException(
        'The counter has already been modified today',
      );

    const { currentCount, lastResetDuration, longestStreak } =
      await this.handleResetData(counterId, teamId);

    const [counter] = await this.$transaction([
      this.counter.update({
        where: { id: counterId, teamId },
        data: {
          currentCount: { set: currentCount },
          lastResetDuration: {
            set: lastResetDuration,
          },
          longestStreak: {
            set: longestStreak,
          },
        },
      }),
      this.counterResetRecord.create({
        data: {
          counterId,
          countBeforeReset: lastResetDuration,
          resetOccurredAt: this.getToday(),
          nameResetEvent: resetCounterDto.nameEvent,
        },
      }),
    ]);

    return { ...counter, alreadyModifiedToday: true };
  }

  private async handleResetData(counterId: string, teamId: string) {
    const prevCounter = await this.counter.findFirst({
      where: {
        id: counterId,
        teamId,
      },
    });

    if (!prevCounter) throw new NotFoundException('');

    const { longestStreak: prevLongestStreak, currentCount: prevCurrentCount } =
      prevCounter;

    const longestStreak = Math.max(prevLongestStreak, prevCurrentCount);

    return {
      currentCount: 0,
      lastResetDuration: prevCurrentCount,
      longestStreak,
    };
  }

  private getToday() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return today;
  }

  private async hasCounterBeenModifiedToday(counterId: string) {
    const alreadyIncrementedCount = await this.counterIncrementRecord.count({
      where: {
        counterId,
        incrementedAt: this.getToday(),
      },
    });

    if (alreadyIncrementedCount < 1) {
      const alreadyResetCount = await this.counterResetRecord.count({
        where: {
          counterId,
          resetOccurredAt: this.getToday(),
        },
      });

      return alreadyResetCount > 0;
    }

    return true;
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
