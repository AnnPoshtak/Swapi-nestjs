import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StarshipService } from './starship.service';
import { CreateStarshipDto } from './dto/create-starship.dto';
import { UpdateStarshipDto } from './dto/update-starship.dto';

@ApiTags('starship')
@Controller('starship')
export class StarshipController {
  constructor(private readonly starshipService: StarshipService) { }

  @Post(':id/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `starship-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Validation failed (expected type is .(png|jpeg|jpg))'),
            false
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required for upload');
    }
    return this.starshipService.addImage(id, file);
  }

  @Delete('image/:imageId')
  removeImage(@Param('imageId') imageId: number) {
    return this.starshipService.removeImage(imageId);
  }

  @Post()  create(@Body() createStarshipDto: CreateStarshipDto) {
    return this.starshipService.create(createStarshipDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
  ) {
    return this.starshipService.findAll(page, 10);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.starshipService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateStarshipDto: UpdateStarshipDto) {
    return this.starshipService.update(id, updateStarshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.starshipService.remove(id);
  }
}
