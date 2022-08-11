import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { TechsService } from './techs.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { Tech } from './entities/tech.entity';

@Controller('techs')
export class TechsController {
  constructor(private readonly techsService: TechsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createTechDto: CreateTechDto): Promise<any> {
    return this.techsService.create(createTechDto);
  }

  @Get()
  async findAll(): Promise<Tech[]> {
    return await this.techsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tech> {
    return this.techsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateTechDto: UpdateTechDto) {
    return this.techsService.update(+id, updateTechDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.techsService.remove(+id);
  }
}
