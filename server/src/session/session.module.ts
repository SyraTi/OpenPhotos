import { forwardRef, Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { SessionController } from './session.controller'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { SessionGuard } from './session.guard'
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
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    SessionService,
  ],
  exports: [SessionService],
})
export class SessionModule {}
