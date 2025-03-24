import { forwardRef, Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { SessionController } from './session.controller'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { SessionGuard } from './guards/session.guard'
import { RolesGuard } from './guards/roles.guard'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [SessionController],
  providers: [
    // 用户登录守卫，SessionModule被AppModule进行import了之后作用于全局
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    // 用户角色守卫，SessionModule被AppModule进行import了之后作用于全局
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    SessionService,
  ],
  exports: [SessionService],
})
export class SessionModule {}
