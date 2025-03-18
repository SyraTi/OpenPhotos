import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { USER_ROLE } from '../entities/user.entity'
import { UseRolesGuard } from '../session/guards/roles.guard'

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  /**
   * 创建图片库
   * @param createGalleryDto
   */
  @UseRolesGuard([USER_ROLE.SU])
  @Post()
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryDto)
  }

  /**
   * 更新图片库
   * @param id
   * @param updateGalleryDto
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(+id, updateGalleryDto)
  }

  /**
   * 获取所有图片库
   */
  @Get()
  findAll() {
    return this.galleryService.findAll()
  }

  /**
   * 删除图片库
   * @param id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(+id)
  }

  /**
   * 获取单个图片库
   * @param id 图片库id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(+id)
  }
}
