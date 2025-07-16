import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Token } from './decorators/token.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RequestResetUserDto } from './dto/request-reset-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering user: ${JSON.stringify(registerUserDto)}`);
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    this.logger.log(`Logging in user: ${JSON.stringify(loginUserDto)}`);
    return this.authService.loginUser(loginUserDto);
  }

  @Post('request-reset')
  requestResetUser(@Body() requestResetUserDto: RequestResetUserDto) {
    return this.authService.requestResetUser(requestResetUserDto);
  }

  @Post('reset-user')
  resetUser(@Body() resetUserDto: ResetUserDto) {
    return this.authService.resetUser(resetUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@Token() token: string) {
    this.logger.log(`Verifying token: ${token}`);
    return this.authService.verifyToken(token);
  }
}
