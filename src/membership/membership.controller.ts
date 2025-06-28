import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/team/guards/admin.guard';
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
