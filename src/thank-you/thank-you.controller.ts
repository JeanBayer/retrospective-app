import {
  Body,
  Controller,
  Delete,
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
import { AdminGuard } from 'src/team/guards/admin.guard';
import { CreateThankYouDto } from './dto/create-thank-you.dto';
import { ThankYouExistInRetroGuard } from './guards/thank-you-exist-in-retro.guard';
import { ThankYouService } from './thank-you.service';

@Controller('teams/:teamId/retrospectives/:retroId/thank-you')
@UseGuards(AuthGuard)
export class ThankYouController {
  constructor(private readonly thankYouService: ThankYouService) {}

  @Post('')
  @UseGuards(
    UserExistInTeam,
    UserBodyExistInTeam,
    RetrospectiveExistInTeamGuard,
    RetrospectiveOpenRequiredGuard,
  )
  createThankYou(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('retroId', ParseUUIDPipe) retrospectiveId: string,
    @Body() createThankYouDto: CreateThankYouDto,
    @User()
    user: CurrentUser,
  ) {
    return this.thankYouService.createThankYou(
      user.id,
      teamId,
      retrospectiveId,
      createThankYouDto,
    );
  }

  @Get('')
  @UseGuards(UserExistInTeam, RetrospectiveExistInTeamGuard)
  getManyThankYou(@Param('retroId', ParseUUIDPipe) retrospectiveId: string) {
    return this.thankYouService.getManyThankYou(retrospectiveId);
  }

  @Delete('/:thankYouId')
  @UseGuards(
    AdminGuard,
    RetrospectiveExistInTeamGuard,
    RetrospectiveOpenRequiredGuard,
    ThankYouExistInRetroGuard,
  )
  deleteThankYou(@Param('thankYouId', ParseUUIDPipe) thankYouId: string) {
    return this.thankYouService.deleteThankYou(thankYouId);
  }
}
