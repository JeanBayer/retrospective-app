import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { envs } from 'src/config/envs';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
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

      return {
        user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('invalid token');
    }
  }
}
