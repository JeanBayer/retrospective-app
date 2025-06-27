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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { validateOrThrow } from 'src/common/validations/validate-or-throw';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinPasswordTeamDto, JoinTeamDto } from './dto/join-team.dto';
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
  getMyTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.teamService.getMyTeam(user.id, teamId);
  }

  @Post('/:teamId')
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

  @UseGuards(AdminGuard)
  @Patch('/:teamId')
  updateTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.updateTeam(teamId, updateTeamDto);
  }

  @Delete('/:teamId')
  leaveTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.teamService.leaveTeam(user.id, teamId);
  }

  @UseGuards(AdminGuard)
  @Post('/:teamId/users/:userId/admin')
  promoteToAdmin(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.teamService.promoteToAdmin(userId, teamId);
  }

  @UseGuards(AdminGuard)
  @Delete('/:teamId/users/:userId/admin')
  demoteFromAdmin(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('teamId', ParseUUIDPipe) teamId: string,
  ) {
    return this.teamService.demoteFromAdmin(userId, teamId);
  }

  @Get('/:teamId/users')
  getUsers(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.teamService.getUsers(user.id, teamId);
  }

  @UseGuards(AdminGuard)
  @Delete('/:teamId/users/:userId')
  leaveUserFromTeam(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('teamId', ParseUUIDPipe) teamId: string,
  ) {
    return this.teamService.leaveUserFromTeam(userId, teamId);
  }
}
