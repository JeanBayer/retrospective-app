import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MembershipService } from '../membership.service';

@Injectable()
export class UserBodyExistInTeam implements CanActivate {
  constructor(private readonly membershipService: MembershipService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    const { teamId } = request.params;
    if (!teamId) {
      throw new ForbiddenException('Team ID is required');
    }
    const { userId } = request.body;

    if (!userId)
      throw new ConflictException('userId field is mandatory in body request');

    try {
      await this.membershipService.userExistInTeam(userId, teamId);
    } catch {
      throw new ForbiddenException("User doesn't exist in this team");
    }
    return true;
  }
}
