import { Injectable } from '@nestjs/common';

export interface User {
  email: string;
  password: string;
  userId: number;
}

const users: User[] = [
  {
    email : "a.poshtak2011@gmail.com",
    password: "123456",
    userId: 1,
  },
  {
    email: "test@gmail.com",
    password: "123456",
    userId: 2,
  }
]

@Injectable()
export class UsersService {
  async findUserByEmail(email: string): Promise<User | undefined> {
    return users.find((user) => user.email === email);
  }
}