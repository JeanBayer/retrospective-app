import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class SprintWinnerService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(SprintWinnerService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async voteWinner(
    userId: string,
    retrospectiveId: string,
    votedForId: string,
  ) {
    await this.throwErrorIfUserAlreadyVotedInRetrospective(
      userId,
      retrospectiveId,
    );
    await this.vote.create({
      data: {
        voterId: userId,
        retrospectiveId,
        votedForId,
      },
    });
  }

  async getWinner(retrospectiveId: string) {
    const retrospective = await this.retrospective.findFirst({
      where: {
        id: retrospectiveId,
      },
      select: {
        sprintWinner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!retrospective?.sprintWinner)
      throw new NotFoundException('Sprint winner dont found');

    return retrospective?.sprintWinner;
  }

  async getVoteStatus(userId: string, retrospectiveId: string) {
    const myVote = await this.vote.findFirst({
      where: {
        retrospectiveId,
        voterId: userId,
      },
    });

    const totalVotes = await this.vote.count({
      where: {
        retrospectiveId,
      },
    });

    return {
      ...myVote,
      totalVotes,
    };
  }

  private async throwErrorIfUserAlreadyVotedInRetrospective(
    userId: string,
    retrospectiveId: string,
  ) {
    const userAlreadyInVotedInRetrospective = await this.vote.findFirst({
      where: {
        retrospectiveId,
        voterId: userId,
      },
    });

    if (userAlreadyInVotedInRetrospective)
      throw new ConflictException(
        'User has already voted in this retrospective',
      );
  }
}
