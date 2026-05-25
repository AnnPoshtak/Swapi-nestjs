import { Controller, Post, Body, Get, NotImplementedException, UseGuards, Request } from '@nestjs/common';
import { AuthService, AuthResult } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() input: CreateAuthDto): Promise<AuthResult> {
    return this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getUserIfo(@Request() request: any) {
    return request.user;
  }
}