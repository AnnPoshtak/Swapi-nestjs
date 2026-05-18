import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateSeedDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'A New Hope' })
  @IsString()
  title: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  episodeId: number;

  @ApiProperty({ example: 'It is a period of civil war...' })
  @IsString()
  openingCrawl: string;

  @ApiProperty({ example: 'George Lucas' })
  @IsString()
  director: string;

  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  @IsString()
  producer: string;

  @ApiProperty({ example: '1977-05-25' })
  @IsString()
  releaseDate: string;

  @ApiProperty({ example: 'https://swapi.dev/api/films/1/' })
  @IsString()
  url: string;
}
