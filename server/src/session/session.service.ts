import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class SessionService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 登录
   * @param {string} username 用户名
   * @param {string} password 密码
   *
   * @returns {{access_token: string}}
   */
  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.validate(username, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
        role: user.role,
      }),
    }
  }

  /**
   * 注册
   * @param {string} username 用户名
   * @param {string} password 密码
   * @param {{isSU: boolean}} options 配置项 isSU: 是否注册为超级管理员
   *
   * @returns {{access_token: string}}
   */
  async register(
    username: string,
    password: string,
    options: { isSU: boolean } = { isSU: false },
  ): Promise<any> {
    let user = null
    if (options.isSU) {
      user = await this.usersService.createSU(username, password)
    } else {
      user = await this.usersService.createOne(username, password)
    }
    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        username: user.username,
        role: user.role,
      }),
    }
  }
}
