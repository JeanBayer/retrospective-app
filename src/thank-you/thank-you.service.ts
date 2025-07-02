import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateThankYouDto } from './dto/create-thank-you.dto';

@Injectable()
export class ThankYouService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ThankYouService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async createThankYou(
    userId: string,
    retrospectiveId: string,
    createThankYouDto: CreateThankYouDto,
  ) {
    return this.thankYou.create({
      data: {
        giverId: userId,
        retrospectiveId,
        receiverId: createThankYouDto.userId,
        message: createThankYouDto.message,
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
  }

  async getManyThankYou(retrospectiveId: string) {
    return this.thankYou.findMany({
      where: {
        retrospectiveId,
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
  }

  async deleteThankYou(thankYouId: string) {
    await this.thankYou.delete({
      where: {
        id: thankYouId,
      },
    });
  }

  async throwErrorIfThankYouDoesNotExistInRetro(
    thanYouId: string,
    retrospectiveId: string,
  ) {
    const thankYou = await this.thankYou.count({
      where: {
        id: thanYouId,
        retrospectiveId,
      },
    });

    if (!thankYou) throw new NotFoundException('ThankYou don`t found');
  }
}
