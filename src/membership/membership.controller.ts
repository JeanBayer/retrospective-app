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
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { validateOrThrow } from 'src/common/validations/validate-or-throw';
import { AdminGuard } from 'src/team/guards/admin.guard';
import { JoinPasswordTeamDto, JoinTeamDto } from './dto/join-team.dto';
import { UserExistInTeam } from './guards/user-exist-in-team.guard';
import { MembershipService } from './membership.service';

@Controller('teams/:teamId/users')
@UseGuards(AuthGuard)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('')
  @UseGuards(UserExistInTeam)
  getUsers(@Param('teamId', ParseUUIDPipe) teamId: string) {
    return this.membershipService.getUsers(teamId);
  }

  @Get('/my-membership')
  @UseGuards(UserExistInTeam)
  getMyMembership(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.membershipService.getMyMembership(teamId, user.id);
  }

  @Post('')
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

    return this.membershipService.joinTeam(joinTeamDto);
  }

  @Delete('')
  @UseGuards(UserExistInTeam)
  leaveTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @User() user: CurrentUser,
  ) {
    return this.membershipService.leaveTeam(user.id, teamId);
  }

  @Delete('/:userId')
  @UseGuards(AdminGuard)
  // TODO: crear un guard para el id del param y validarlo con el team
  leaveUserFromTeam(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('teamId', ParseUUIDPipe) teamId: string,
  ) {
    return this.membershipService.leaveUserFromTeam(userId, teamId);
  }

  @Post('/:userId/admin')
  @UseGuards(AdminGuard)
  // TODO: crear un guard para el id del param y validarlo con el team
  promoteToAdmin(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.membershipService.promoteToAdmin(userId, teamId);
  }

  @Delete('/:userId/admin')
  @UseGuards(AdminGuard)
  // TODO: crear un guard para el id del param y validarlo con el team
  demoteFromAdmin(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('teamId', ParseUUIDPipe) teamId: string,
  ) {
    return this.membershipService.demoteFromAdmin(userId, teamId);
  }
}
