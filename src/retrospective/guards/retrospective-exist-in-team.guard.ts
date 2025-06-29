import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RetrospectiveService } from '../retrospective.service';

@Injectable()
export class RetrospectiveExistInTeamGuard implements CanActivate {
  constructor(private readonly retrospectiveService: RetrospectiveService) {}

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

    const { retroId } = request.params;
    if (!retroId) {
      throw new ForbiddenException('Retrospective ID is required');
    }

    try {
      await this.retrospectiveService.retrospectiveExistInTeam(teamId, retroId);
    } catch {
      throw new ForbiddenException("Counter doesn't exist in this team");
    }
    return true;
  }
}
