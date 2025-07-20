import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { JoinTeamDto } from './dto/join-team.dto';

@Injectable()
export class MembershipService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(MembershipService.name);

  constructor(private readonly websocketGateway: WebsocketGateway) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async joinTeam(joinTeamDto: JoinTeamDto) {
    const { userId, teamId, joinPassword } = joinTeamDto;

    await this.throwErrorIfUserExistInTeam(userId, teamId);

    const { joinPassword: _, ...team } =
      await this.throwErrorIfPasswordDoesNotExistInTeam(teamId, joinPassword);

    try {
      await this.teamMembership.create({
        data: {
          teamId,
          userId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) throw new ConflictException(error.message);
      throw new ConflictException('Error while trying to join the team.');
    }

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'MEMBERSHIP-LIST'],
      data: {},
    });

    return team;
  }

  async leaveTeam(userId: string, teamId: string) {
    try {
      await this.teamMembership.delete({
        where: {
          userId_teamId: {
            teamId,
            userId,
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('Error while trying to leave the team.');
    }

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS'],
      data: {},
    });
  }

  async promoteToAdmin(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

    await this.teamMembership.update({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
      data: {
        isAdmin: true,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'MEMBERSHIP-LIST'],
      data: {},
    });
  }

  async demoteFromAdmin(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

    await this.teamMembership.update({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
      data: {
        isAdmin: false,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'MEMBERSHIP-LIST'],
      data: {},
    });
  }

  async leaveUserFromTeam(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

    await this.teamMembership.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'MEMBERSHIP-LIST'],
      data: {},
    });
  }

  async getUsers(teamId: string) {
    return await this.teamMembership.findMany({
      where: {
        teamId,
      },
      select: {
        userId: true,
        teamId: true,
        isAdmin: true,
        joinedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            sprintWins: true,
          },
        },
      },
    });
  }

  async getMyMembership(teamId: string, userId: string) {
    return await this.teamMembership.findFirst({
      where: {
        teamId,
        userId,
      },
      select: {
        userId: true,
        teamId: true,
        isAdmin: true,
        joinedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            sprintWins: true,
          },
        },
      },
    });
  }

  async userExistInTeam(userId: string, teamId: string) {
    return this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);
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

  private async throwErrorIfUserExistInTeam(userId: string, teamId: string) {
    const userAlreadyInTeam = await this.teamMembership.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (userAlreadyInTeam)
      throw new ConflictException('User is already a member of this team');

    return null;
  }

  private async throwErrorIfPasswordDoesNotExistInTeam(
    teamId: string,
    password: string,
  ) {
    const team = await this.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) throw new NotFoundException('Team dont found');

    const isPasswordEqual = compareSync(password, team.joinPassword);
    if (!isPasswordEqual) throw new ConflictException('Invalid password team');

    return team;
  }
}
