import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Luke Skywalker', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '172', required: false })
  @IsOptional()
  @IsString()
  height?: string;

  @ApiProperty({ example: '77', required: false })
  @IsOptional()
  @IsString()
  mass?: string;

  @ApiProperty({ example: 'blond', required: false })
  @IsOptional()
  @IsString()
  hairColor?: string;

  @ApiProperty({ example: 'fair', required: false })
  @IsOptional()
  @IsString()
  skinColor?: string;

  @ApiProperty({ example: 'blue', required: false })
  @IsOptional()
  @IsString()
  eyeColor?: string;

  @ApiProperty({ example: '19BBY', required: false })
  @IsOptional()
  @IsString()
  birthYear?: string;

  @ApiProperty({ example: 'male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'https://swapi.dev/api/people/1/', required: false })
  @IsOptional()
  @IsString()
  url?: string;
}

