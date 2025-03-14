import { Module } from '@nestjs/common';
import { ScanTaskService } from './scan-task.service';
import { ScanTaskController } from './scan-task.controller';

@Module({
  controllers: [ScanTaskController],
  providers: [ScanTaskService],
})
export class ScanTaskModule {}
