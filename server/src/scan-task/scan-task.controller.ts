import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScanTaskService } from './scan-task.service';
import { CreateScanTaskDto } from './dto/create-scan-task.dto';
import { UpdateScanTaskDto } from './dto/update-scan-task.dto';

@Controller('scan-task')
export class ScanTaskController {
  constructor(private readonly scanTaskService: ScanTaskService) {}

  @Post()
  create(@Body() createScanTaskDto: CreateScanTaskDto) {
    return this.scanTaskService.create(createScanTaskDto);
  }

  @Get()
  findAll() {
    return this.scanTaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scanTaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScanTaskDto: UpdateScanTaskDto) {
    return this.scanTaskService.update(+id, updateScanTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scanTaskService.remove(+id);
  }
}
