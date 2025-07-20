import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CreateThankYouDto } from './dto/create-thank-you.dto';

@Injectable()
export class ThankYouService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ThankYouService.name);

  constructor(private readonly websocketGateway: WebsocketGateway) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async createThankYou(
    userId: string,
    teamId: string,
    retrospectiveId: string,
    createThankYouDto: CreateThankYouDto,
  ) {
    const thankYou = await this.thankYou.create({
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

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'RETROSPECTIVES', retrospectiveId, 'THANK-YOU'],
      data: thankYou,
    });

    return thankYou;
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
      orderBy: {
        createdAt: 'asc',
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
