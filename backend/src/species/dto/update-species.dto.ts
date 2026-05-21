import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSpeciesDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	id?: number;

	@ApiProperty({ example: 'Human', required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({ example: 'mammal', required: false })
	@IsOptional()
	@IsString()
	classification?: string;

	@ApiProperty({ example: 'sentient', required: false })
	@IsOptional()
	@IsString()
	designation?: string;

	@ApiProperty({ example: '180', required: false })
	@IsOptional()
	@IsString()
	averageHeight?: string;

	@ApiProperty({ example: 'caucasian, black', required: false })
	@IsOptional()
	@IsString()
	skinColors?: string;

	@ApiProperty({ example: 'blonde, brown', required: false })
	@IsOptional()
	@IsString()
	hairColors?: string;

	@ApiProperty({ example: 'brown, blue', required: false })
	@IsOptional()
	@IsString()
	eyeColors?: string;

	@ApiProperty({ example: '120', required: false })
	@IsOptional()
	@IsString()
	averageLifespan?: string;

	@ApiProperty({ example: 'Galactic Basic', required: false })
	@IsOptional()
	@IsString()
	language?: string;

	@ApiProperty({ example: 'https://swapi.dev/api/species/1/', required: false })
	@IsOptional()
	@IsString()
	url?: string;
}
