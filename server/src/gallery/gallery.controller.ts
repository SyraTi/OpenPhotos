import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { CreateGalleryDto } from './dto/create-gallery.dto'
import { UpdateGalleryDto } from './dto/update-gallery.dto'
import { USER_ROLE } from '../entities/user.entity'
import { UseRolesGuard } from '../session/guards/roles.guard'
import { SessionRequest } from '../session/guards/session.guard'

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
  @UseRolesGuard([USER_ROLE.SU])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(+id, updateGalleryDto)
  }

  /**
   * 获取所有图片库
   */
  @Get()
  findAll(@Request() req: SessionRequest) {
    switch (req.user.role) {
      case USER_ROLE.SU:
        return this.galleryService.findAll()
      case USER_ROLE.USER:
        return this.galleryService.findAllByUser(+req.user.sub)
    }
  }

  /**
   * 删除图片库
   * @param id
   */
  @UseRolesGuard([USER_ROLE.SU])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(+id)
  }
}
