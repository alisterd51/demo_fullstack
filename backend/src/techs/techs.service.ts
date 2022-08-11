import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { Tech } from './entities/tech.entity';

@Injectable()
export class TechsService {
  constructor(@InjectRepository(Tech) private techRepo: Repository<Tech>) {}

  create(createTechDto: CreateTechDto): Promise<any> {
    return this.techRepo.insert(createTechDto);
  }

  findAll(): Promise<Tech[]> {
    return this.techRepo.find();
  }

  findOne(id: number): Promise<Tech | null> {
    return this.techRepo.findOne({
      where: {id}
    });
  }

  update(id: number, updateTechDto: UpdateTechDto): Promise<any> {
    return this.techRepo.update(id, updateTechDto);
  }

  remove(id: number): Promise<any> {
    return this.techRepo.delete(id);
  }
}
