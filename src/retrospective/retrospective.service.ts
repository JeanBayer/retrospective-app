import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CreateRetrospectiveDto } from './dto/create-retrospective.dto';
import { UpdateRetrospectiveDto } from './dto/update-retrospective.dto';

@Injectable()
export class RetrospectiveService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(RetrospectiveService.name);

  constructor(private readonly websocketGateway: WebsocketGateway) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async createRetrospective(
    teamId: string,
    createRetrospectiveDto: CreateRetrospectiveDto,
  ) {
    const lastRetroNumber = await this.getLastRetrospectiveNumber(teamId);

    try {
      const retrospective = await this.retrospective.create({
        data: {
          ...createRetrospectiveDto,
          retrospectiveNumber: lastRetroNumber + 1,
          teamId,
        },
      });

      this.websocketGateway.server.to(teamId).emit('team', {
        entity: ['TEAMS', retrospective.teamId, 'RETROSPECTIVES'],
        data: {},
      });

      return retrospective;
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException(
        'Error while trying to create the retrospective. Please try again later.',
      );
    }
  }

  async getRetrospectives(teamId: string) {
    const retrospectives = await this.retrospective.findMany({
      where: {
        teamId,
      },
      select: {
        id: true,
        retrospectiveName: true,
        retrospectiveNumber: true,
        status: true,
        teamId: true,
        createdAt: true,
        sprintWinner: {
          select: {
            id: true,
            name: true,
            sprintWins: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return retrospectives;
  }

  async updateRetrospective(
    retroId: string,
    createRetrospectiveDto: UpdateRetrospectiveDto,
  ) {
    const retrospective = await this.retrospective.update({
      where: {
        id: retroId,
      },
      data: {
        ...createRetrospectiveDto,
      },
    });

    this.websocketGateway.server.to(retrospective.teamId).emit('team', {
      entity: ['TEAMS', retrospective.teamId, 'RETROSPECTIVES'],
      data: {},
    });

    return retrospective;
  }

  async closeRetrospective(retroId: string) {
    const sprintWinnerId = await this.calculateSprintWinner(retroId);

    const [retrospective] = await this.$transaction([
      this.retrospective.update({
        where: {
          id: retroId,
        },
        data: {
          status: 'CLOSED',
          sprintWinnerId,
        },
        select: {
          id: true,
          retrospectiveName: true,
          retrospectiveNumber: true,
          status: true,
          teamId: true,
          createdAt: true,
          sprintWinner: {
            select: {
              id: true,
              name: true,
              sprintWins: true,
            },
          },
        },
      }),
      this.user.update({
        where: {
          id: sprintWinnerId,
        },
        data: {
          sprintWins: {
            increment: 1,
          },
        },
      }),
    ]);

    this.websocketGateway.server.to(retrospective.teamId).emit('team', {
      entity: ['TEAMS', retrospective.teamId, 'RETROSPECTIVES'],
      data: {},
    });

    return retrospective;
  }

  async getRetrospective(retroId: string) {
    const retrospective = await this.retrospective.findFirst({
      where: {
        id: retroId,
      },
      select: {
        id: true,
        retrospectiveName: true,
        retrospectiveNumber: true,
        status: true,
        teamId: true,
        createdAt: true,
        sprintWinner: {
          select: {
            id: true,
            name: true,
            sprintWins: true,
          },
        },
      },
    });

    return retrospective;
  }

  async retrospectiveExistInTeam(teamId: string, retroId: string) {
    return await this.throwErrorIfRetrospectiveDoesNotExistInTeam(
      teamId,
      retroId,
    );
  }

  async retrospectiveOpenRequired(retroId: string) {
    return await this.throwErrorIfRetrospectiveDoesNotOpenState(retroId);
  }

  async getLastRetrospectiveNumber(teamId: string) {
    const latest = await this.retrospective.findFirst({
      where: { teamId },
      orderBy: { retrospectiveNumber: 'desc' },
    });

    return latest?.retrospectiveNumber || 1;
  }

  private async calculateSprintWinner(retroId: string) {
    const winners = await this.selectSprintWinner(retroId);

    // If there are multiple winners, we should select one randomly
    let selectedWinner = winners[0].votedForId;

    if (winners.length > 1) {
      const randomIndex = Math.floor(Math.random() * winners.length);
      selectedWinner = winners[randomIndex].votedForId;
    }

    return selectedWinner;
  }

  private async selectSprintWinner(retroId: string) {
    const votes = await this.vote.groupBy({
      where: {
        retrospectiveId: retroId,
      },
      by: ['votedForId'],
      _count: {
        votedForId: true,
      },
      orderBy: {
        _count: {
          votedForId: 'desc',
        },
      },
    });

    if (votes.length === 0) {
      throw new NotFoundException('No votes found for this retrospective');
    }

    const maxVotes = votes[0]._count.votedForId;

    return votes
      .filter((vote) => vote._count.votedForId === maxVotes)
      .map((vote) => ({
        votedForId: vote.votedForId,
        count: vote._count.votedForId,
      }));
  }

  private async throwErrorIfRetrospectiveDoesNotExistInTeam(
    teamId: string,
    retroId: string,
  ) {
    const retrospective = await this.retrospective.count({
      where: {
        id: retroId,
        teamId,
      },
    });

    if (!retrospective)
      throw new NotFoundException('Retrospective don`t found');
  }

  private async throwErrorIfRetrospectiveDoesNotOpenState(retroId: string) {
    const retrospective = await this.retrospective.count({
      where: {
        id: retroId,
        status: 'CREATED',
      },
    });

    if (!retrospective)
      throw new NotFoundException('Retrospective with open status don`t found');
  }
}
