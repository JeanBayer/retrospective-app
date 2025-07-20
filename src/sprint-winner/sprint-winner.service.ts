import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class SprintWinnerService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(SprintWinnerService.name);

  constructor(private readonly websocketGateway: WebsocketGateway) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async voteWinner(
    userId: string,
    teamId: string,
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

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: [
        'TEAMS',
        teamId,
        'RETROSPECTIVES',
        retrospectiveId,
        'SPRINT-WINNER',
        'VOTE-STATUS',
      ],
      data: {},
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
            sprintWins: true,
          },
        },
      },
    });

    if (!retrospective?.sprintWinner)
      throw new NotFoundException('Sprint winner dont found');

    return retrospective?.sprintWinner;
  }

  async getVoteStatus(userId: string, retrospectiveId: string, teamId: string) {
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

    const totalMembers = await this.teamMembership.count({
      where: {
        teamId,
      },
    });

    const retrospectiveStatusResult = await this.retrospective.findFirst({
      where: {
        id: retrospectiveId,
      },
      select: {
        status: true,
      },
    });

    return {
      myVote,
      totalVotes,
      totalMembers,
      statusRetrospective: retrospectiveStatusResult?.status || 'CLOSED',
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
