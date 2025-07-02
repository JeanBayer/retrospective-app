import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class ThankYouService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ThankYouService.name);
  async onModuleInit() {
    await this.$connect();
  }
}
