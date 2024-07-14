import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { RegisterUserDto } from './dto/register.dto';
import { AuthUser } from 'src/decorators/authUser';
import { User } from '@prisma/client';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  registerUser(@Body() registerBody: RegisterUserDto) {
    return this.authService.register(registerBody);
  }

  @Post('login')
  // @UseGuards(AuthGuard('local'))
  async loginUser(@Body() user: LoginUserDto) {
    return await this.authService.login(user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  user(@AuthUser() user: User) {
    return user;
  }

  @Get('refresh-token')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
