import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlanetDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	id?: number;

	@ApiProperty({ example: 'Tatooine', required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({ example: '23', required: false })
	@IsOptional()
	@IsString()
	rotationPeriod?: string;

	@ApiProperty({ example: '304', required: false })
	@IsOptional()
	@IsString()
	orbitalPeriod?: string;

	@ApiProperty({ example: '10465', required: false })
	@IsOptional()
	@IsString()
	diameter?: string;

	@ApiProperty({ example: 'arid', required: false })
	@IsOptional()
	@IsString()
	climate?: string;

	@ApiProperty({ example: '1 standard', required: false })
	@IsOptional()
	@IsString()
	gravity?: string;

	@ApiProperty({ example: 'desert', required: false })
	@IsOptional()
	@IsString()
	terrain?: string;

	@ApiProperty({ example: '1', required: false })
	@IsOptional()
	@IsString()
	surfaceWater?: string;

	@ApiProperty({ example: '200000', required: false })
	@IsOptional()
	@IsString()
	population?: string;

	@ApiProperty({ example: 'https://swapi.dev/api/planets/1/', required: false })
	@IsOptional()
	@IsString()
	url?: string;
}
