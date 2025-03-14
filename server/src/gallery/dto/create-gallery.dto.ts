import { IsNotEmpty, IsArray } from 'class-validator'
export class CreateGalleryDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  path: string

  @IsArray()
  userIds: number[] = []
}
