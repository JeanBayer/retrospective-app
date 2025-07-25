import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { sendEmail } from 'src/common/lib/email';
import { envs } from 'src/config/envs';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RequestResetUserDto } from './dto/request-reset-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import {
  JwtPayload,
  JwtPayloadWithMetadata,
} from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma client connected successfully');
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  async resetUser(resetUserDto: ResetUserDto) {
    const user = await this.user.findUnique({
      where: {
        email: resetUserDto.email,
      },
    });

    if (!user) throw new NotFoundException('User dont found');

    const passwordReset = await this.passwordReset.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!passwordReset)
      throw new ConflictException('Password reset dont found');

    const isCodeEqual = compareSync(
      resetUserDto.code.toString(),
      passwordReset.code,
    );

    if (!isCodeEqual) {
      await this.passwordReset.delete({ where: { id: passwordReset.id } });
      throw new ConflictException('Code invalid, generate a new code');
    }

    const timeDifference =
      passwordReset.expiresAt.getTime() - new Date().getTime();

    if (timeDifference < 0) {
      await this.passwordReset.delete({ where: { id: passwordReset.id } });
      throw new ConflictException('Code expired, generate a new code');
    }

    await this.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashSync(resetUserDto.password, 10),
      },
    });

    await this.passwordReset.delete({ where: { id: passwordReset.id } });

    const { id, name, email } = user;

    return { id, name, email };
  }

  async requestResetUser(requestResetUserDto: RequestResetUserDto) {
    const user = await this.user.findUnique({
      where: {
        email: requestResetUserDto.email,
      },
    });

    if (!user) throw new NotFoundException('User dont found');

    const passwordReset = await this.passwordReset.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (passwordReset) {
      const timeDifference =
        passwordReset.expiresAt.getTime() - new Date().getTime();

      if (timeDifference > 0)
        throw new ConflictException('Code already sent to the email');

      await this.passwordReset.delete({ where: { id: passwordReset.id } });
    }

    const { code, hashedCode } = this.generateResetCode();
    await this.passwordReset.create({
      data: {
        code: hashedCode,
        expiresAt: this.generateFutureDate(),
        userId: user.id,
      },
    });

    await sendEmail({
      email: user.email,
      template: {
        type: 'password-reset',
        data: { code, name: user.name, minutes: 10 },
      },
    });
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    const existUser = await this.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new ConflictException('User is already exist');
    }

    const user = await this.user.create({
      data: {
        email,
        name,
        password: hashSync(password, 10),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return {
      user,
      token: await this.signJWT(user),
    };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) throw new ConflictException('User/Password invalid');

    const isPasswordEqual = compareSync(loginUserDto.password, user.password);

    if (!isPasswordEqual) throw new ConflictException('User/Password invalid');

    const { id, name, email } = user;

    return {
      user: {
        id,
        name,
        email,
      },
      token: await this.signJWT({
        id,
        name,
        email,
      }),
    };
  }

  async verifyToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { sub, iat, exp, ...user } =
        this.jwtService.verify<JwtPayloadWithMetadata>(token, {
          secret: envs.JWT_SECRET,
        });

      // TODO: crear logica para invalidar el token al resetear la contraseña

      return {
        user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('invalid token');
    }
  }

  private generateFutureDate() {
    const expiresAt10Minutes = new Date();
    expiresAt10Minutes.setMinutes(expiresAt10Minutes.getMinutes() + 10);

    return expiresAt10Minutes;
  }

  private generateRandomSixDigitNumber() {
    const min = 100000; // Smallest 6-digit number
    const max = 999999; // Largest 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateResetCode() {
    const code = this.generateRandomSixDigitNumber();
    const hashedCode = hashSync(code.toString(), 10);

    return { code, hashedCode };
  }
}
