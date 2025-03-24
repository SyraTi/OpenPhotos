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
import { User } from './user.entity'
import { File } from './file.entity'

/**
 * @class Gallery 图片库实体类
 * @property {number} id 主键
 * @property {string} path 图片路径
 * @property {number} count 图片数量
 * @property {number} scan_task_id 扫描任务id
 * @property {Date} createdAt 创建时间
 * @property {Date} updatedAt 更新时间
 * @property {Date} deletedAt 删除时间
 *
 * @property {User[]} users 允许访问的用户
 * @property {File[]} files 图片库下面的文件
 */
@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    unique: true,
  })
  path: string

  @Column({
    default: 0,
  })
  count: number

  @Column({
    nullable: true,
    default: null,
  })
  scan_task_id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToMany(() => User)
  @JoinTable()
  users: User[]

  @ManyToMany(() => File)
  @JoinTable()
  files: File[]
}
