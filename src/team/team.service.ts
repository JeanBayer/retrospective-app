import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateTeamDto } from './dto/create-team.dto';

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
        joinPassword,
        memberships: {
          create: {
            userId: '04ecd051-1e64-42cf-8f33-0a0988391824',
            isAdmin: true,
          },
        },
      },
    });

    return team;
  }
}
