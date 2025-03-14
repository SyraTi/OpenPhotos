import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SessionModule } from './session/session.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GalleryModule } from './gallery/gallery.module'
import { FileModule } from './file/file.module'
import { ScanTaskModule } from './scan-task/scan-task.module'
import * as process from 'node:process'
import { ScanTask } from './entities/scan-task.entity'
import { Gallery } from './entities/gallery.entity'
import { File } from './entities/file.entity'

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
        entities: [User, Gallery, File, ScanTask],
        subscribers: [],
        migrations: [],
      }),
    }),
    SessionModule,
    UserModule,
    GalleryModule,
    FileModule,
    ScanTaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
