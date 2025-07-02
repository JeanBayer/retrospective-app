import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ThankYouService } from '../thank-you.service';

@Injectable()
export class ThankYouExistInRetroGuard implements CanActivate {
  constructor(private readonly thankYouService: ThankYouService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    const { retroId } = request.params;
    if (!retroId) {
      throw new ForbiddenException('Retrospective ID is required');
    }

    const { thankYouId } = request.params;
    if (!thankYouId) {
      throw new ForbiddenException('ThankYou ID is required');
    }

    try {
      await this.thankYouService.throwErrorIfThankYouDoesNotExistInRetro(
        thankYouId,
        retroId,
      );
    } catch {
      throw new ForbiddenException(
        'The retrospective must be open to perform this action.',
      );
    }
    return true;
  }
}
