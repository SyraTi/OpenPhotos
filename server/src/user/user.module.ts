import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '../entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../session/session.module'
import { UserController } from './user.controller'

@Module({
  imports: [forwardRef(() => SessionModule), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
