import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    create(createUserDto: CreateUserDto): Promise<any> {
        return this.userRepo.insert(createUserDto);
    }

    findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    findOne(id: number): Promise<User | null>;    
    findOne(username: string): Promise<User | null>;
    findOne(idOrUsername?: number | string): Promise<User | null> {
        if (typeof(idOrUsername) === 'number')
        {
            return this.userRepo.findOne({
                where: {id: idOrUsername}
            });
        } else {
            return this.userRepo.findOne({
                where: {username: idOrUsername}
            });
        }
    }

    update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
        return this.userRepo.update(id, updateUserDto);
    }

    remove(id: number): Promise<any> {
        return this.userRepo.delete(id);
    }
}
