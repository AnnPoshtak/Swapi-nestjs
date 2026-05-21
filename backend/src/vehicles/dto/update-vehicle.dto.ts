import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateVehicleDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	id?: number;

	@ApiProperty({ example: 'Sand Crawler', required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({ example: 'Digger Crawler', required: false })
	@IsOptional()
	@IsString()
	model?: string;

	@ApiProperty({ example: 'Corellia Mining Corporation', required: false })
	@IsOptional()
	@IsString()
	manufacturer?: string;

	@ApiProperty({ example: '150000', required: false })
	@IsOptional()
	@IsString()
	costInCredits?: string;

	@ApiProperty({ example: '36.8', required: false })
	@IsOptional()
	@IsString()
	length?: string;

	@ApiProperty({ example: '30', required: false })
	@IsOptional()
	@IsString()
	maxAtmospheringSpeed?: string;

	@ApiProperty({ example: '46', required: false })
	@IsOptional()
	@IsString()
	crew?: string;

	@ApiProperty({ example: '30', required: false })
	@IsOptional()
	@IsString()
	passengers?: string;

	@ApiProperty({ example: '50000', required: false })
	@IsOptional()
	@IsString()
	cargoCapacity?: string;

	@ApiProperty({ example: '2 days', required: false })
	@IsOptional()
	@IsString()
	consumables?: string;

	@ApiProperty({ example: 'wheeled', required: false })
	@IsOptional()
	@IsString()
	vehicleClass?: string;

	@ApiProperty({ example: 'https://swapi.dev/api/vehicles/4/', required: false })
	@IsOptional()
	@IsString()
	url?: string;
}
