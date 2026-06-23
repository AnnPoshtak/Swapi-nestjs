import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedModule } from './seed/seed.module';
import { FilmModule } from './film/film.module';
import { StarshipModule } from './starship/starship.module';
import { VehiclesModule } from './vehicles/vehicles.module';

import { LoggerMiddleware } from './logger.middleware';
import { PeopleModule } from './people/people.module';
import { PlanetsModule } from './planets/planets.module';
import { SpeciesModule } from './species/species.module';

import { dataSourceOptions } from './data-source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions, 
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 15,  
      },
    ]),
    UsersModule,
    AuthModule,
    FilesModule,
    SeedModule,
    FilmModule,
    PeopleModule,
    PlanetsModule,
    SpeciesModule,
    StarshipModule,
    VehiclesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}