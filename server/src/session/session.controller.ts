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
import { Public } from './guards/session.guard'
import { LoginDto } from './dto/login.dto'

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put()
  login(@Body() loginDto: LoginDto) {
    return this.sessionService.login(loginDto.username, loginDto.password)
  }

  @Get()
  getProfile(@Request() req: any) {
    return req.user
  }
}
