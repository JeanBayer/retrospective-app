import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { TimeUtils } from 'src/common/lib/time';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CreateTimerDto } from './dto/create-timer.dto';

@Injectable()
export class TimerService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(TimerService.name);
  constructor(private readonly websocketGateway: WebsocketGateway) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async createTimer(teamId: string, createTimerDto: CreateTimerDto) {
    const { minutes } = createTimerDto;

    // Validar si ya existe un timer activo o vencido
    const existTimerValid = await this.validateOrDeleteExpiredTimer(teamId);
    if (existTimerValid) {
      throw new ConflictException('Ya existe un timer activo');
    }

    // Guardar endsAt en UTC
    const endsAt = TimeUtils.addMinutesToCurrentTimeUTC(minutes);

    const timer = await this.timer.create({
      data: {
        teamId,
        duration: Number(minutes),
        isActive: true,
        endsAt,
      },
    });

    this.websocketGateway.server.to(teamId).emit('team', {
      entity: ['TEAMS', teamId, 'TIMER'],
      data: {},
    });

    return timer;
  }

  async getTimer(teamId: string) {
    return await this.validateOrDeleteExpiredTimer(teamId);
  }

  // Método privado para validar timer activo o eliminar si está vencido
  private async validateOrDeleteExpiredTimer(teamId: string) {
    const timer = await this.timer.findFirst({
      where: { teamId, isActive: true },
    });
    if (!timer) return;

    const currentTimeUTC = TimeUtils.getCurrentTimeUTC();
    if (currentTimeUTC > timer.endsAt) {
      await this.timer.delete({ where: { id: timer.id } });
      return;
    }
    // Si sigue activo, retorna el timer
    return timer;
  }
}
