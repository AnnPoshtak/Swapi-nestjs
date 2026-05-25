import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface SignInData {
  email: string;
  id: number;
  role: string;
}

export interface AuthResult {
  accessToken: string;
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (isPasswordMatching) {
        return {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      email: user.email,
      id: user.id,
      role: user.role
    };
  }

  async register(email: string, pass: string) {
    const newUser = await this.usersService.createUser(email, pass);

    return {
      message: 'Registration successful!',
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
  }
}