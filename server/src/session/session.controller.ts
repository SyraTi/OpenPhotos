import {
  Body,
  Controller,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  Put,
} from '@nestjs/common'
import { SessionService } from './session.service'
import { Public, SessionRequest } from './guards/session.guard'
import { LoginDto } from './dto/login.dto'

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  /**
   * 登录
   * @param {LoginDto} loginDto 登录信息
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Put()
  login(@Body() loginDto: LoginDto) {
    return this.sessionService.login(loginDto.username, loginDto.password)
  }

  /**
   * 获取用户信息
   * @param {SessionRequest} req 已登录的Request
   */
  @Get()
  getProfile(@Request() req: SessionRequest) {
    return req.user
  }
}
