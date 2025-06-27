import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { CounterService } from './counter.service';
import { CreateCounterDto } from './dto/create-counter.dto';

@Controller('teams/:teamId/counters')
@UseGuards(AuthGuard)
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get('')
  getCounters(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.counterService.getCounters(user.id, teamId);
  }

  @Post('')
  createTeam(
    @Body() createCounterDto: CreateCounterDto,
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.counterService.createCounter(user.id, teamId, createCounterDto);
  }

  @Get('/:counterId')
  getCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @User() user: CurrentUser,
  ) {
    return this.counterService.getCounter(user.id, teamId, counterId);
  }
}
