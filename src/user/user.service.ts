import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  async onModuleInit() {
    await this.$connect();
  }

  async getMyUser(userId: string) {
    return await this.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        sprintWins: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateMyUser(userId: string, updateUserDto: UpdateUserDto) {
    let dataToUpdate: UpdateUserDto = {
      ...updateUserDto,
    };

    if (updateUserDto?.password) {
      dataToUpdate = {
        ...dataToUpdate,
        password: hashSync(updateUserDto.password, 10),
      };
    }

    return this.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dataToUpdate,
      },
      select: {
        id: true,
        name: true,
        email: true,
        sprintWins: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
