import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly teamService: TeamService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    const { teamId } = request.params;
    if (!teamId) {
      throw new ForbiddenException('Team ID is required');
    }
    const { user } = request;

    if (!user || !user?.id) {
      throw new ForbiddenException('User is not authenticated');
    }

    try {
      await this.teamService.userIsAdmin(user?.id, teamId);
    } catch {
      throw new ForbiddenException("User doesn't admin of this team");
    }
    return true;
  }
}
