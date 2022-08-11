import { Module } from '@nestjs/common';
import { TechsService } from './techs.service';
import { TechsController } from './techs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tech } from './entities/tech.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tech])],
  controllers: [TechsController],
  providers: [TechsService]
})
export class TechsModule {}
