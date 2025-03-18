import { USER_ROLE } from '../../entities/user.entity'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserJWTPayload } from '../session.service'

const ROLES_KEY = 'roles'
export const UseRolesGuard = (roles: USER_ROLE[]) =>
  SetMetadata(ROLES_KEY, roles)
/**
 * 角色守卫
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredRoles || requiredRoles.length === 0) {
      return true // 如果没有指定角色，则默认通过
    }

    const request = context.switchToHttp().getRequest()
    if (!request['user']) {
      console.error('Public与UseRolesGuard不可以同时使用！')
      throw new UnauthorizedException()
    }
    const user: UserJWTPayload = request['user'] // 用户信息
    if (requiredRoles.includes(user.role)) {
      return true
    } else {
      throw new ForbiddenException()
    }
  }
}
