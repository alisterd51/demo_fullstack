import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { TechsModule } from './techs/techs.module';
import { Tech } from './techs/entities/tech.entity';

@Module({
  imports: [
    TodosModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Tech]
    }),
    TechsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
