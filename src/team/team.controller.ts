import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/interfaces/current-user.interface';
import { validateOrThrow } from 'src/common/validate-or-throw';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinPasswordTeamDto, JoinTeamDto } from './dto/join-team.dto';
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
    @Body() joinTeamPasswordTeamDto: JoinPasswordTeamDto,
    @Param('teamId') teamId: string,
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
}
