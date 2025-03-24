import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { Gallery } from '../entities/gallery.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { SERVICE_STATUS, ServiceReturn } from '../utils/types'
import { GalleryResponseDto } from './dto/gallery-response.dto'

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(
    createGalleryDto: CreateGalleryDto,
  ): Promise<ServiceReturn<GalleryResponseDto>> {
    try {
      const pathExists = await this.galleryRepository.existsBy({
        path: createGalleryDto.path,
      })
      if (pathExists) {
        return {
          status: SERVICE_STATUS.ERROR,
          reason: '路径已存在',
        }
      }
      const gallery = new Gallery()
      gallery.path = createGalleryDto.path
      gallery.name = createGalleryDto.name
      let users = []
      if (createGalleryDto.userIds) {
        users = await this.userRepository
          .createQueryBuilder()
          .where('id IN (:...userIds)', {
            userIds: createGalleryDto.userIds,
          })
          .getMany()
      }
      gallery.users = users
      const result = await this.galleryRepository.save(gallery)
      return {
        status: SERVICE_STATUS.SUCCESS,
        data: {
          id: result.id,
          name: result.name,
          path: result.path,
          count: result.count,
          userIds: users.map((user) => user.id),
        },
      }
    } catch (e) {
      console.error(e)
      throw new ServiceUnavailableException()
    }
  }

  /**
   * 获取所有图库
   */
  async findAll(): Promise<ServiceReturn<GalleryResponseDto[]>> {
    try {
      const galleries = await this.galleryRepository.find({
        relations: {
          users: true,
        },
      })
      return {
        status: SERVICE_STATUS.SUCCESS,
        data: galleries.map((gallery) => ({
          id: gallery.id,
          name: gallery.name,
          path: gallery.path,
          count: gallery.count,
          userIds: gallery.users.map((user) => user.id),
        })),
      }
    } catch (e) {
      console.error(e)
      throw new ServiceUnavailableException()
    }
  }

  /**
   * 根据用户id获取图库列表
   * @param {number} userId 用户id
   */
  async findAllByUser(
    userId: number,
  ): Promise<ServiceReturn<GalleryResponseDto[]>> {
    try {
      const galleries = await this.galleryRepository
        .createQueryBuilder('gallery')
        .innerJoin('gallery.users', 'users')
        .where('users.id = :userId', { userId })
        .getMany()
      return {
        status: SERVICE_STATUS.SUCCESS,
        data: galleries.map((gallery) => ({
          id: gallery.id,
          name: gallery.name,
          path: gallery.path,
          count: gallery.count,
        })),
      }
    } catch (e) {
      console.error(e)
      throw new ServiceUnavailableException()
    }
  }

  /**
   * 更新图库
   * @param {number} id 图库id
   * @param {UpdateGalleryDto} updateGalleryDto 更新项
   */
  async update(id: number, updateGalleryDto: UpdateGalleryDto) {
    try {
      const gallery = await this.galleryRepository.findOne({ where: { id } })
      if (updateGalleryDto.path) {
        gallery.path = updateGalleryDto.path
      }
      if (updateGalleryDto.name) {
        gallery.name = updateGalleryDto.name
      }
      if (Array.isArray(updateGalleryDto.userIds)) {
        const users = await this.userRepository
          .createQueryBuilder('user')
          .where('user.id IN (:...userIds)', {
            userIds: updateGalleryDto.userIds,
          })
          .execute()
        gallery.users = users
      }
      await this.galleryRepository.save(gallery)
    } catch (e) {
      console.error(e)
      throw new ServiceUnavailableException()
    }
  }

  /**
   * 根据id删除图库
   * @param {number} id 图库id
   */
  async remove(id: number): Promise<ServiceReturn<{ affected: number }>> {
    try {
      const result = await this.galleryRepository.softDelete({ id })
      return {
        status: SERVICE_STATUS.SUCCESS,
        data: { affected: result.affected },
      }
    } catch (e) {
      console.error(e)
      throw new ServiceUnavailableException()
    }
  }
}
