import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { Gallery } from '../entities/gallery.entity'
import { Repository } from 'typeorm'
import path from 'path'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { SERVICE_STATUS, ServiceReturn } from '../utils/types'
import { GalleryResponseDto } from './dto/gallery-response.dto'
import crypto from 'crypto'
import sharp from 'sharp'
import exifReader from 'exif-reader'
import { dmsToDecimal } from '../utils'

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

  async uploadFile(
    id: number,
    files: Array<Express.Multer.File>,
  ): Promise<ServiceReturn<any>> {
    try {
      const gallery = await this.galleryRepository.findOneBy({ id })
      if (!gallery) {
        return {
          status: SERVICE_STATUS.ERROR,
          reason: '图库不存在',
        }
      }
      for (const file of files) {
        const filePath = path.join(gallery.path, file.originalname)
        const mimetype = file.mimetype
        const hash = crypto
          .createHash('sha256')
          .update(file.buffer)
          .digest('hex')
        const size = file.size
        let width = 0
        let height = 0
        let orientation = null
        let exif = null
        const gps_lng = null
        const gps_lat = null
        const token_at = null
        switch (mimetype) {
          case 'image/jpeg':
          case 'image/jpg':
          case 'image/png':
          case 'image/webp':
          case 'image/gif':
          case 'image/bmp':
            // 获取图片的宽高
            const metadata = await sharp(file.buffer).metadata()
            width = metadata.width
            height = metadata.height
            orientation = metadata.orientation ?? null
            exif = metadata.exif ? exifReader(metadata.exif) : null
            if (exif) {
              gps_lng = dmsToDecimal(
                ...(exif.GPSInfo.GPSLongitude as [number, number, number]),
                exif.GPSInfo.GPSLongitudeRef,
              )
              gps_lat = dmsToDecimal(
                ...(exif.GPSInfo.GPSLatitude as [number, number, number]),
                exif.GPSInfo.GPSLatitudeRef,
              )
              token_at = exif.Photo.DateTimeOriginal
            }

          // todo is_live_photo 不同平台格式过于复杂 暂时先不做
          // todo is_screenshot、is_selfie、keyword、ocr_result AI任务暂时不做
          case 'video/mp4':
            break
          default:
            break
        }

        // todo generation tasks
        // 包括生成缩略图、ai扫描等等
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
