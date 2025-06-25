import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';

@Injectable()
export class TeamService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const { name, joinPassword } = createTeamDto;
    const team = await this.team.create({
      data: {
        name,
        joinPassword: hashSync(joinPassword, 10),
        memberships: {
          create: {
            userId: '04ecd051-1e64-42cf-8f33-0a0988391824',
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
  }

  async joinTeam(joinTeamDto: JoinTeamDto) {
    const { userId, teamId, joinPassword } = joinTeamDto;

    const userAlreadyInTeam = await this.validateUserExistInTeam(
      userId,
      teamId,
    );

    if (userAlreadyInTeam)
      throw new ConflictException('User is already a member of this team');

    try {
      const { joinPassword: _, ...team } = await this.validatePasswordInTeam(
        teamId,
        joinPassword,
      );

      await this.teamMembership.create({
        data: {
          teamId,
          userId,
        },
      });

      return team;
    } catch (error: unknown) {
      if (error instanceof Error) throw new ConflictException(error.message);
      throw new ConflictException('Error while trying to join the team.');
    }
  }

  private async validateUserExistInTeam(userId: string, teamId: string) {
    return this.teamMembership.findFirst({
      where: {
        userId,
        teamId,
      },
    });
  }

  private async validatePasswordInTeam(teamId: string, password: string) {
    const team = await this.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) throw new Error('Team don"t found');

    const isPasswordEqual = compareSync(password, team.joinPassword);
    if (!isPasswordEqual) throw new Error('Invalid password team');

    return team;
  }
}
