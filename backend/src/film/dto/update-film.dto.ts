import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFilmDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	id?: number;

	@ApiProperty({ example: 'A New Hope', required: false })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiProperty({ example: 4, required: false })
	@IsOptional()
	@IsNumber()
	episodeId?: number;

	@ApiProperty({ example: 'It is a period of civil war...', required: false })
	@IsOptional()
	@IsString()
	openingCrawl?: string;

	@ApiProperty({ example: 'George Lucas', required: false })
	@IsOptional()
	@IsString()
	director?: string;

	@ApiProperty({ example: 'Gary Kurtz, Rick McCallum', required: false })
	@IsOptional()
	@IsString()
	producer?: string;

	@ApiProperty({ example: '1977-05-25', required: false })
	@IsOptional()
	@IsString()
	releaseDate?: string;

	@ApiProperty({ example: 'https://swapi.dev/api/films/1/', required: false })
	@IsOptional()
	@IsString()
	url?: string;
}
