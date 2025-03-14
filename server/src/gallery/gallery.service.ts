import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { Gallery } from '../entities/gallery.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createGalleryDto: CreateGalleryDto) {
    try {
      const gallery = new Gallery()
      gallery.path = createGalleryDto.path
      gallery.name = createGalleryDto.name
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id IN (:...userIds)', {
          userIds: createGalleryDto.userIds,
        })
        .execute()
      gallery.users = users
      await this.galleryRepository.save(gallery)
    } catch (e) {
      throw new ServiceUnavailableException()
    }
  }

  findAll() {
    return `This action returns all gallery`
  }

  findOne(id: number) {
    return `This action returns a #${id} gallery`
  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`
  }
}
