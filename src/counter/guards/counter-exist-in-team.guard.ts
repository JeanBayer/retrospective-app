import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CounterService } from '../counter.service';

@Injectable()
export class CounterExistInTeam implements CanActivate {
  constructor(private readonly counterService: CounterService) {}

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

    const { counterId } = request.params;
    if (!counterId) {
      throw new ForbiddenException('Counter ID is required');
    }

    try {
      await this.counterService.counterExistInTeam(teamId, counterId);
    } catch {
      throw new ForbiddenException("Counter doesn't exist in this team");
    }
    return true;
  }
}
