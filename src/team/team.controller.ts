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
import { plainToInstance } from 'class-transformer';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/interfaces/current-user.interface';
import { validateOrThrow } from 'src/common/validate-or-throw';
import { AdminGuard } from 'src/config/guards/admin.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinPasswordTeamDto, JoinTeamDto } from './dto/join-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@Controller('team')
@UseGuards(AuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('')
  createTeam(@Body() createTeamDto: CreateTeamDto, @User() user: CurrentUser) {
    return this.teamService.createTeam(createTeamDto, user.id);
  }

  @Post('/:teamId/join')
  joinTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() joinTeamPasswordTeamDto: JoinPasswordTeamDto,
    @User() user: CurrentUser,
  ) {
    const joinTeamDto: JoinTeamDto = plainToInstance(JoinTeamDto, {
      teamId,
      joinPassword: joinTeamPasswordTeamDto.joinPassword,
      userId: user.id,
    });

    validateOrThrow(joinTeamDto);

    return this.teamService.joinTeam(joinTeamDto);
  }

  @Get('')
  getMyTeams(@User() user: CurrentUser) {
    return this.teamService.getMyTeams(user.id);
  }

  @Get('/:teamId')
  getMyTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.teamService.getMyTeam(user.id, teamId);
  }

  @Delete('/:teamId')
  leaveTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.teamService.leaveTeam(user.id, teamId);
  }

  @UseGuards(AdminGuard)
  @Patch('/:teamId')
  updateTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @User() user: CurrentUser,
  ) {
    return this.teamService.updateTeam(user.id, teamId, updateTeamDto);
  }
}
