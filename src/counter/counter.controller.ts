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
import { CounterExistInTeam } from './guards/counter-exist-in-team.guard';

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
  @UseGuards(CounterExistInTeam)
  getCounter(@Param('counterId', ParseUUIDPipe) counterId: string) {
    return this.counterService.getCounter(counterId);
  }

  @Patch('/:counterId')
  @UseGuards(AdminGuard)
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  updateCounter(
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() updateCounterDto: UpdateCounterDto,
  ) {
    return this.counterService.updateCounter(counterId, updateCounterDto);
  }

  @Delete('/:counterId')
  @UseGuards(AdminGuard)
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  deleteCounter(@Param('counterId', ParseUUIDPipe) counterId: string) {
    return this.counterService.deleteCounter(counterId);
  }

  @Post('/:counterId/increment')
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  incrementCounter(@Param('counterId', ParseUUIDPipe) counterId: string) {
    return this.counterService.incrementCounter(counterId);
  }

  @Post('/:counterId/reset')
  @UseGuards(UserExistInTeam)
  @UseGuards(CounterExistInTeam)
  resetCounter(
    @Param('counterId', ParseUUIDPipe) counterId: string,
    @Body() resetCounterDto: ResetCounterDto,
  ) {
    return this.counterService.resetCounter(counterId, resetCounterDto);
  }
}
