import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
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
    RetrospectiveExistInTeamGuard,
    RetrospectiveOpenRequiredGuard,
  )
  voteWinner() {
    return this.sprintWinnerService.voteWinner();
  }

  @Get('')
  @UseGuards(UserExistInTeam, RetrospectiveExistInTeamGuard)
  getWinner() {
    return this.sprintWinnerService.getWinner();
  }
}
