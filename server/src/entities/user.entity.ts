import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Gallery } from './gallery.entity'

/**
 * @enum USER_ROLE 用户角色
 * @property {string} SU 超级用户
 * @property {string} USER 普通用户
 */
export enum USER_ROLE {
  SU = 'SU',
  USER = 'USER',
}

/**
 * @class User 用户实体类
 * @property {number} id 主键
 * @property {USER_ROLE} role 用户角色
 * @property {string} username 用户名
 * @property {string} password 密码
 * @property {Date} createdAt 创建时间
 * @property {Date} updatedAt 更新时间
 * @property {Date} deletedAt 删除时间
 *
 * @property {Gallery[]} galleries 可访问的图库
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  })
  role: USER_ROLE

  @Column({
    unique: true,
  })
  username: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToMany(() => Gallery)
  galleries: Gallery[]
}
