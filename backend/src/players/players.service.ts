import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(@InjectRepository(Player) private playerRepo: Repository<Player>) {}

  create(createPlayerDto: CreatePlayerDto) {
    return this.playerRepo.insert(createPlayerDto);
  }

  findAll(): Promise<Player[]> {
    return this.playerRepo.find();
  }

  findOne(id: number) {
    return this.playerRepo.findOneBy({id: id});
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return this.playerRepo.update(id, updatePlayerDto);
  }

  remove(id: number) {
    return this.playerRepo.delete(id);
  }
}
