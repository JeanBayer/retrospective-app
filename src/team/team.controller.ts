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
import { UserExistInTeam } from '../membership/guards/user-exist-in-team.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AdminGuard } from './guards/admin.guard';
import { TeamService } from './team.service';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('')
  getMyTeams(@User() user: CurrentUser) {
    return this.teamService.getMyTeams(user.id);
  }

  @Post('')
  createTeam(@Body() createTeamDto: CreateTeamDto, @User() user: CurrentUser) {
    return this.teamService.createTeam(createTeamDto, user.id);
  }

  @Get('/:teamId')
  @UseGuards(UserExistInTeam)
  getMyTeam(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.teamService.getMyTeam(teamId);
  }

  @UseGuards(AdminGuard)
  @Patch('/:teamId')
  updateTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.updateTeam(teamId, updateTeamDto);
  }

  @Get('/:teamId/ranking')
  @UseGuards(UserExistInTeam)
  getRanking(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.teamService.getRanking(teamId);
  }
}
