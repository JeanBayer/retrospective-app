import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { CreateTeamDto } from './dto/create-team.dto';
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

  async getMyTeam(teamId: string) {
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

  async updateTeam(teamId: string, updateTeam: UpdateTeamDto) {
    let dataToUpdate: UpdateTeamDto = {
      ...updateTeam,
    };

    if (updateTeam?.joinPassword) {
      dataToUpdate = {
        ...dataToUpdate,
        joinPassword: hashSync(updateTeam.joinPassword, 10),
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
}
