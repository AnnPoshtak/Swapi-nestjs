import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ 
    example: 'test@gmail.com', 
    description: "User's email"
  })
  email!: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'User`s password' 
  })
  password!: string;
}