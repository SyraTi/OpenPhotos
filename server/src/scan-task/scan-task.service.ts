import { Injectable } from '@nestjs/common';
import { CreateScanTaskDto } from './dto/create-scan-task.dto';
import { UpdateScanTaskDto } from './dto/update-scan-task.dto';

@Injectable()
export class ScanTaskService {
  create(createScanTaskDto: CreateScanTaskDto) {
    return 'This action adds a new scanTask';
  }

  findAll() {
    return `This action returns all scanTask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scanTask`;
  }

  update(id: number, updateScanTaskDto: UpdateScanTaskDto) {
    return `This action updates a #${id} scanTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} scanTask`;
  }
}
