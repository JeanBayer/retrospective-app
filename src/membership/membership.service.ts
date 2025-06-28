import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class MembershipService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(MembershipService.name);
  async onModuleInit() {
    await this.$connect();
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
}
