import { BadRequestException, Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User, USER_ROLE } from '../entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  /**
   * 创建超级用户
   * @param {string} username 用户名
   * @param {string} password 密码
   *
   * @returns {{id: number, username: string, role: USER_ROLE}}
   */
  async createSU(
    username: string,
    password: string,
  ): Promise<UserDto | undefined> {
    const isSUExist = await this.usersRepository.exists({
      where: { role: USER_ROLE.SU },
    })
    // 超级用户已存在
    if (isSUExist) {
      throw new BadRequestException('超级用户已存在')
    }
    const isUserExist = await this.usersRepository.exists({
      where: { username },
    })
    // 目标用户已存在
    if (isUserExist) {
      throw new BadRequestException('用户已存在')
    }
    const user = new User()
    user.role = USER_ROLE.SU
    user.username = username
    user.password = bcrypt.hashSync(password, 10)
    const createdUser = await this.usersRepository.save(user)
    return {
      id: createdUser.id,
      username: createdUser.username,
      role: createdUser.role,
    }
  }

  /**
   * 创建用户
   * @param {string} username 用户名
   * @param {string} password 密码
   *
   * @returns {{id: number, username: string, role: USER_ROLE}}
   */
  async createOne(
    username: string,
    password: string,
  ): Promise<UserDto | undefined> {
    const isUserExist = await this.usersRepository.exists({
      where: { username },
    })
    // 目标用户已存在
    if (isUserExist) {
      throw new BadRequestException('用户已存在')
    }
    const user = new User()
    user.username = username
    user.password = bcrypt.hashSync(password, 10)
    const createdUser = await this.usersRepository.save(user)
    return {
      id: createdUser.id,
      username: createdUser.username,
      role: createdUser.role,
    }
  }

  /**
   * 验证用户登录有效性
   * @param {string} username 用户名
   * @param {string} password 密码
   *
   * @returns {{id: number, username: string, role: USER_ROLE}}
   */
  async validate(
    username: string,
    password: string,
  ): Promise<UserDto | undefined> {
    const targetUser = await this.usersRepository.findOne({
      where: { username },
    })
    // 未找到目标用户
    if (!targetUser) {
      return undefined
    }
    // 密码不通过
    if (!(await bcrypt.compare(password, targetUser.password))) {
      return undefined
    }
    return {
      id: targetUser.id,
      username: targetUser.username,
      role: targetUser.role,
    }
  }
}
