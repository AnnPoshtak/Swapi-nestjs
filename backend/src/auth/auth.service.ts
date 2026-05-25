import { Injectable, UnauthorizedException } from '@nestjs/common';
import {  UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { emit } from 'process';

interface AuthInput {
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  userId: number;
}

export interface AuthResult {
  accessToken: string;
  userId: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async authenticate(input: AuthInput): Promise<AuthResult>{
    const user = await this.validateUser(input);

    if (!user){
      throw new UnauthorizedException()
    }

    return this.signIn(user)
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(input.email)

    if (user && user.password === input.password){
      return{
        userId: user.userId,
        email: user.email
      }
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult>{
    const tokenPayload = {
      sub: user.userId,
      email: user.email
    }

    const accessToken = await this.jwtService.signAsync(tokenPayload)
    return { accessToken, email: user.email, userId: user.userId }
  }
}
