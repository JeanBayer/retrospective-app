import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateRetrospectiveDto } from './dto/create-retrospective.dto';

@Injectable()
export class RetrospectiveService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(RetrospectiveService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async createRetrospective(
    teamId: string,
    createRetrospectiveDto: CreateRetrospectiveDto,
  ) {
    const retrospective = await this.retrospective.create({
      data: {
        ...createRetrospectiveDto,
        teamId,
      },
    });

    return retrospective;
  }

  async getRetrospectives(teamId: string) {
    const retrospectives = await this.retrospective.findMany({
      where: {
        teamId,
      },
    });

    return retrospectives;
  }
}
