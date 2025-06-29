import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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

  async getRetrospective(retroId: string) {
    const retrospective = await this.retrospective.findFirst({
      where: {
        id: retroId,
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
}
