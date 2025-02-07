import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
export enum USER_ROLE {
  SU = 'SU',
  USER = 'USER',
}

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
}
