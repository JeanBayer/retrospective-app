import { Body, Controller, Post } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('')
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.createTeam(createTeamDto);
  }

  @Post('join')
  joinTeam(@Body() joinTeamDto: JoinTeamDto) {
    return this.teamService.joinTeam(joinTeamDto);
  }
}
