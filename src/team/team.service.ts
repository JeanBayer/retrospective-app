import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(TeamService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async createTeam(createTeamDto: CreateTeamDto, userId: string) {
    const { name, joinPassword } = createTeamDto;

    try {
      const team = await this.team.create({
        data: {
          name,
          joinPassword: hashSync(joinPassword, 10),
          memberships: {
            create: {
              userId,
              isAdmin: true,
            },
          },
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return team;
    } catch (error: unknown) {
      this.logger.error('Error creating team', error);
      throw new InternalServerErrorException(
        'An error occurred. Please try again later.',
      );
    }
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

    return team;
  }

  async getMyTeams(userId: string) {
    const teams = await this.team.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return teams;
  }

  async getMyTeam(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

    return this.team.findFirst({
      where: {
        id: teamId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async leaveTeam(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

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
  }

  async updateTeam(teamId: string, updateTeam: UpdateTeamDto) {
    let dataToUpdate: UpdateTeamDto = {};

    if (updateTeam?.joinPassword) {
      dataToUpdate = {
        ...dataToUpdate,
        joinPassword: hashSync(updateTeam.joinPassword, 10),
      };
    }

    if (updateTeam?.name) {
      dataToUpdate = {
        ...dataToUpdate,
        name: updateTeam.name,
      };
    }

    return this.team.update({
      where: {
        id: teamId,
      },
      data: {
        ...dataToUpdate,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
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
  }

  async getUsers(userId: string, teamId: string) {
    await this.throwErrorIfUserDoesNotExistInTeam(userId, teamId);

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
          },
        },
      },
    });
  }

  async userIsAdmin(userId: string, teamId: string) {
    return this.throwErrorIfUserDoesNotAdminInTeam(userId, teamId);
  }

  private async throwErrorIfUserDoesNotAdminInTeam(
    userId: string,
    teamId: string,
  ) {
    const userIsAdminInTeam = await this.teamMembership.findFirst({
      where: {
        userId,
        teamId,
        isAdmin: true,
      },
    });

    if (!userIsAdminInTeam) throw new ForbiddenException('User is not admin');

    return userIsAdminInTeam;
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
