import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Gallery } from './gallery.entity'

/**
 * @class File 文件实体类
 * @property {number} id 主键
 * @property {string} path 文件路径
 * @property {string} mimetype 文件类型
 * @property {string} thumbnail 缩略图
 * @property {string} filename 文件名
 * @property {string} hash 文件hash
 * @property {number} size 文件大小
 * @property {number} width 图片宽
 * @property {number} height 图片高
 * @property {number} duration 视频时长
 * @property {number} orientation 图片方向
 * @property {number} gps_lng gps经度
 * @property {number} gps_lat gps纬度
 * @property {boolean} is_live_photo 是否为live photo
 * @property {boolean} is_screenshot 是否为截图
 * @property {boolean} is_screen_record 是否为录屏
 * @property {boolean} is_selfie 是否为自拍
 * @property {string} keyword 关键字
 * @property {string} ocr_result ocr识别结果
 * @property {Date} token_at 拍摄时间
 * @property {Date} createdAt 创建时间
 * @property {Date} updatedAt 更新时间
 * @property {Date} deletedAt 删除时间
 *
 * @property {Gallery} galleries 属于哪个图片库
 */
@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  path: string

  @Column()
  mimetype: string

  @Column()
  thumbnail: string

  @Column()
  filename: string

  @Column()
  hash: string

  @Column()
  size: number

  @Column()
  width: number

  @Column()
  height: number

  @Column()
  duration: number

  @Column({
    nullable: true,
    default: null,
  })
  orientation: number

  @Column({
    nullable: true,
    default: null,
  })
  gps_lng: number

  @Column({
    nullable: true,
    default: null,
  })
  gps_lat: number

  @Column({
    default: false,
  })
  is_live_photo: boolean

  @Column({
    default: false,
  })
  is_screenshot: boolean

  @Column({
    default: false,
  })
  is_screen_record: boolean

  @Column({
    default: false,
  })
  is_selfie: boolean

  @Column({
    default: '',
  })
  keyword: string

  @Column({
    default: '',
  })
  ocr_result: string

  @Column()
  token_at: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToMany(() => Gallery)
  galleries: Gallery[]
}
