import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Controller('players')
export class PlayersController {
  constructor(private readonly usersService: PlayersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.usersService.create(createPlayerDto);
  }

  @Get()
  async findAll(): Promise<Player[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.usersService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
