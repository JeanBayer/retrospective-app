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
import { UserBodyExistInTeam } from 'src/membership/guards/user-body-exist-in-team.guard';
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { RetrospectiveExistInTeamGuard } from 'src/retrospective/guards/retrospective-exist-in-team.guard';
import { RetrospectiveOpenRequiredGuard } from 'src/retrospective/guards/retrospective-open-required.guard';
import { SprintWinnerService } from './sprint-winner.service';

@Controller('teams/:teamId/retrospectives/:retroId/sprint-winner')
@UseGuards(AuthGuard)
export class SprintWinnerController {
  constructor(private readonly sprintWinnerService: SprintWinnerService) {}

  @Post('')
  @UseGuards(
    UserExistInTeam,
    UserBodyExistInTeam,
    RetrospectiveExistInTeamGuard,
    RetrospectiveOpenRequiredGuard,
  )
  voteWinner(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('retroId', ParseUUIDPipe) retrospectiveId: string,
    @Body('userId', ParseUUIDPipe) votedForId: string,
    @User()
    user: CurrentUser,
  ) {
    return this.sprintWinnerService.voteWinner(
      user.id,
      teamId,
      retrospectiveId,
      votedForId,
    );
  }

  @Get('')
  @UseGuards(UserExistInTeam, RetrospectiveExistInTeamGuard)
  getWinner(@Param('retroId', ParseUUIDPipe) retrospectiveId: string) {
    return this.sprintWinnerService.getWinner(retrospectiveId);
  }

  @Get('vote-status')
  @UseGuards(UserExistInTeam, RetrospectiveExistInTeamGuard)
  getVoteStatus(
    @Param('retroId', ParseUUIDPipe) retrospectiveId: string,
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User()
    user: CurrentUser,
  ) {
    return this.sprintWinnerService.getVoteStatus(
      user.id,
      retrospectiveId,
      teamId,
    );
  }
}
