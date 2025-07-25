import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MembershipService } from '../membership.service';

@Injectable()
export class UserExistInTeam implements CanActivate {
  constructor(private readonly membershipService: MembershipService) {}

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
      await this.membershipService.userExistInTeam(user?.id, teamId);
    } catch {
      throw new ForbiddenException("User doesn't exist in this team");
    }
    return true;
  }
}
