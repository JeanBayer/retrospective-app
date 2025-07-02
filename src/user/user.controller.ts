import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  getMyUser(@User() user: CurrentUser) {
    return this.userService.getMyUser(user.id);
  }

  @Patch('')
  updateMyUser(
    @User() user: CurrentUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMyUser(user.id, updateUserDto);
  }

  @Get('/thank-you')
  getThankYou(@Query('type') type: string, @User() user: CurrentUser) {
    return this.userService.getThankYou(user.id, type);
  }
}
