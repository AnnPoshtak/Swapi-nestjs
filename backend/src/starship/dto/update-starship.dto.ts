import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStarshipDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	id?: number;

	@ApiProperty({ example: 'Millennium Falcon', required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({ example: 'YT-1300 light freighter', required: false })
	@IsOptional()
	@IsString()
	model?: string;

	@ApiProperty({ example: 'Corellian Engineering Corporation', required: false })
	@IsOptional()
	@IsString()
	manufacturer?: string;

	@ApiProperty({ example: '100000', required: false })
	@IsOptional()
	@IsString()
	costInCredits?: string;

	@ApiProperty({ example: '34.37', required: false })
	@IsOptional()
	@IsString()
	length?: string;

	@ApiProperty({ example: '1050', required: false })
	@IsOptional()
	@IsString()
	maxAtmospheringSpeed?: string;

	@ApiProperty({ example: '4', required: false })
	@IsOptional()
	@IsString()
	crew?: string;

	@ApiProperty({ example: '6', required: false })
	@IsOptional()
	@IsString()
	passengers?: string;

	@ApiProperty({ example: '100000', required: false })
	@IsOptional()
	@IsString()
	cargoCapacity?: string;

	@ApiProperty({ example: '2 months', required: false })
	@IsOptional()
	@IsString()
	consumables?: string;

	@ApiProperty({ example: '0.5', required: false })
	@IsOptional()
	@IsString()
	hyperdriveRating?: string;

	@ApiProperty({ example: '75', required: false })
	@IsOptional()
	@IsString()
	MGLT?: string;

	@ApiProperty({ example: 'Light freighter', required: false })
	@IsOptional()
	@IsString()
	starshipClass?: string;

	@ApiProperty({ example: 'https://swapi.dev/api/starships/10/', required: false })
	@IsOptional()
	@IsString()
	url?: string;
}
