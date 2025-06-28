import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { AdminGuard } from 'src/team/guards/admin.guard';
import { CounterService } from './counter.service';
import { CreateCounterDto } from './dto/create-counter.dto';
import { ResetCounterDto } from './dto/reset-counter.dto';
import { UpdateCounterDto } from './dto/update-counter.dto';

@Controller('teams/:teamId/counters')
@UseGuards(AuthGuard)
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get('')
  @UseGuards(UserExistInTeam)
  getCounters(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.counterService.getCounters(teamId);
  }

  @Post('')
  @UseGuards(UserExistInTeam)
  createTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() createCounterDto: CreateCounterDto,
  ) {
    return this.counterService.createCounter(teamId, createCounterDto);
  }

  @Get('/:counterId')
  @UseGuards(UserExistInTeam)
  getCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
  ) {
    return this.counterService.getCounter(teamId, counterId);
  }

  @Patch('/:counterId')
  @UseGuards(UserExistInTeam)
  updateCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() updateCounterDto: UpdateCounterDto,
  ) {
    return this.counterService.updateCounter(
      teamId,
      counterId,
      updateCounterDto,
    );
  }

  @Delete('/:counterId')
  @UseGuards(AdminGuard)
  @UseGuards(UserExistInTeam)
  deleteCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
  ) {
    return this.counterService.deleteCounter(teamId, counterId);
  }

  @Post('/:counterId/increment')
  @UseGuards(UserExistInTeam)
  incrementCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
  ) {
    return this.counterService.incrementCounter(teamId, counterId);
  }

  @Post('/:counterId/reset')
  @UseGuards(UserExistInTeam)
  resetCounter(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() resetCounterDto: ResetCounterDto,
  ) {
    return this.counterService.resetCounter(teamId, counterId, resetCounterDto);
  }
}
