import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const tokenHeader = this.extractTokenFromHeader(request);
    if (!tokenHeader) {
      throw new UnauthorizedException();
    }
    try {
      const { user, token } = await this.authService.verifyToken(tokenHeader);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request['user'] = user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request['token'] = token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
