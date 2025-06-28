import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { CounterService } from './counter.service';
import { CreateCounterDto } from './dto/create-counter.dto';
import { ResetCounterDto } from './dto/reset-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';

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
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() createCounterDto: CreateCounterDto,
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

  @Patch('/:counterId')
  updateCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() updateCounterDto: UpdateCounterDto,
    @User() user: CurrentUser,
  ) {
    return this.counterService.updateCounter(
      user.id,
      teamId,
      counterId,
      updateCounterDto,
    );
  }

  @Post('/:counterId/increment')
  incrementCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @User() user: CurrentUser,
  ) {
    return this.counterService.incrementCounter(user.id, teamId, counterId);
  }

  @Post('/:counterId/reset')
  resetCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() resetCounterDto: ResetCounterDto,
    @User() user: CurrentUser,
  ) {
    return this.counterService.resetCounter(
      user.id,
      teamId,
      counterId,
      resetCounterDto,
    );
  }
}
