import { Module } from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { GalleryController } from './gallery.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Gallery } from '../entities/gallery.entity'
import { User } from '../entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, User])],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
