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
import { UserExistInTeam } from 'src/membership/guards/user-exist-in-team.guard';
import { AdminGuard } from 'src/team/guards/admin.guard';
import { CreateRetrospectiveDto } from './dto/create-retrospective.dto';
import { UpdateRetrospectiveDto } from './dto/update-retrospective.dto';
import { RetrospectiveExistInTeamGuard } from './guards/retrospective-exist-in-team.guard';
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

  @Patch('/:retroId')
  @UseGuards(AdminGuard, RetrospectiveExistInTeamGuard)
  updateRetrospective(
    @Param('retroId', ParseUUIDPipe) retroId: string,
    @Body() updateRetrospectiveDto: UpdateRetrospectiveDto,
  ) {
    return this.retrospectiveService.updateRetrospective(
      retroId,
      updateRetrospectiveDto,
    );
  }
}
