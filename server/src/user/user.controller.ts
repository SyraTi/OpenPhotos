import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { Public } from '../session/session.guard'
import { RegisterDto } from './dto/register.dto'
import { SessionService } from '../session/session.service'

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put('su')
  createSU(@Body() registerDto: RegisterDto) {
    return this.sessionService.register(
      registerDto.username,
      registerDto.password,
      {
        isSU: true,
      },
    )
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put()
  register(@Body() registerDto: RegisterDto) {
    return this.sessionService.register(
      registerDto.username,
      registerDto.password,
    )
  }
}
