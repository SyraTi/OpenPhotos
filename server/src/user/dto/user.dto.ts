import { USER_ROLE } from '../../entities/user.entity'

export class UserDto {
  id: number
  username: string
  role: USER_ROLE
}
