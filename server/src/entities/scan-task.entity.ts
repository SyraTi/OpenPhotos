import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

enum SCAN_STATUS {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

/**
 @class ScanTask 扫描任务实体类
 @property {number} id 主键
 @property {number} gallery_id 目标图片库id
 @property {number} progress 扫描进度
 @property {SCAN_STATUS} status 扫描任务状态
 @property {Date} createdAt 创建时间
 @property {Date} updatedAt 更新时间
 @property {Date} deletedAt 删除时间

 */
@Entity()
export class ScanTask {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gallery_id: number

  @Column()
  progress: number

  @Column({
    type: 'enum',
    enum: SCAN_STATUS,
    default: SCAN_STATUS.CREATED,
  })
  status: SCAN_STATUS

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
