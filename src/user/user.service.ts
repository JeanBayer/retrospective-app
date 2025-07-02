import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async getThankYou(userId: string, type: string) {
    let result: unknown = [];

    if (type === 'GIVER')
      result = await this.thankYou.findMany({
        where: {
          giverId: userId,
        },
        select: {
          id: true,
          message: true,
          giverId: true,
          giver: {
            select: {
              id: true,
              name: true,
            },
          },
          receiverId: true,
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
          retrospectiveId: true,
          createdAt: true,
        },
      });

    if (type === 'RECEIVER')
      result = await this.thankYou.findMany({
        where: {
          receiverId: userId,
        },
        select: {
          id: true,
          message: true,
          giverId: true,
          giver: {
            select: {
              id: true,
              name: true,
            },
          },
          receiverId: true,
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
          retrospectiveId: true,
          createdAt: true,
        },
      });

    return result;
  }
}
