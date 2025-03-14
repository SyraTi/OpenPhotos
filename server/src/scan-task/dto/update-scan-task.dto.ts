import { PartialType } from '@nestjs/mapped-types';
import { CreateScanTaskDto } from './create-scan-task.dto';

export class UpdateScanTaskDto extends PartialType(CreateScanTaskDto) {}
