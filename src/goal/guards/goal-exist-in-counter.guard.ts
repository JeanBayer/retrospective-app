import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GoalService } from '../goal.service';

@Injectable()
export class GoalExistInCounter implements CanActivate {
  constructor(private readonly goalService: GoalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    const { goalId } = request.params;
    if (!goalId) {
      throw new ForbiddenException('Goal ID is required');
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
      await this.goalService.goalExistInCounter(goalId, counterId);
    } catch {
      throw new ForbiddenException("Counter doesn't exist in this team");
    }
    return true;
  }
}
