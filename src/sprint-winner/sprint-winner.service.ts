import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class SprintWinnerService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(SprintWinnerService.name);
  async onModuleInit() {
    await this.$connect();
  }

  voteWinner() {}

  getWinner() {}
}
