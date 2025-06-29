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
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { CreateRetrospectiveDto } from './dto/create-retrospective.dto';
import { RetrospectiveExistInTeamGuard } from './guards/counter-exist-in-team.guard';
import { RetrospectiveService } from './retrospective.service';

@Controller('teams/:teamId/retrospectives')
@UseGuards(AuthGuard)
export class RetrospectiveController {
  constructor(private readonly retrospectiveService: RetrospectiveService) {}

  @Post('')
  @UseGuards(UserExistInTeam)
  createRetrospective(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() createRetrospectiveDto: CreateRetrospectiveDto,
  ) {
    return this.retrospectiveService.createRetrospective(
      teamId,
      createRetrospectiveDto,
    );
  }

  @Get('')
  @UseGuards(UserExistInTeam)
  getRetrospectives(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.retrospectiveService.getRetrospectives(teamId);
  }

  @Get('/:retroId')
  @UseGuards(UserExistInTeam, RetrospectiveExistInTeamGuard)
  getRetrospective(@Param('retroId', ParseUUIDPipe) retroId: string) {
    return this.retrospectiveService.getRetrospective(retroId);
  }
}
