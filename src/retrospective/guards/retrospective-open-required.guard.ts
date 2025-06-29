import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RetrospectiveService } from '../retrospective.service';

@Injectable()
export class RetrospectiveOpenRequiredGuard implements CanActivate {
  constructor(private readonly retrospectiveService: RetrospectiveService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    const { retroId } = request.params;
    if (!retroId) {
      throw new ForbiddenException('Retrospective ID is required');
    }

    try {
      await this.retrospectiveService.retrospectiveOpenRequired(retroId);
    } catch {
      throw new ForbiddenException(
        'The retrospective must be open to perform this action.',
      );
    }
    return true;
  }
}
