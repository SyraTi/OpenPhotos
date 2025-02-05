import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SessionModule } from './session/session.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as process from 'node:process'

const IS_DEV = process.env.NODE_ENV === 'development'
console.log(process.env.NODE_ENV)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: IS_DEV ? '.env.development' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: IS_DEV,
        logging: IS_DEV,
        entities: [User],
        subscribers: [],
        migrations: [],
      }),
    }),
    SessionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
