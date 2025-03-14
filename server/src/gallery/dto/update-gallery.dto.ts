import { IsArray, IsOptional } from 'class-validator'
export class UpdateGalleryDto {
  @IsOptional()
  name: string

  @IsOptional()
  path: string

  @IsArray()
  userIds: number[] = []
}
