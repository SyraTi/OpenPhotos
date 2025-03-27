import { IsArray } from 'class-validator'
export class CreateFileDto {
  @IsArray()
  files: File[] = []
}
