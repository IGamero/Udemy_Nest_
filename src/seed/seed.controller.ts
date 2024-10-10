import { Controller, Get, Param, Query } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedParamsDto } from './dto/seedParams.dto';
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed(@Query() queryParams: SeedParamsDto) {
    const { limit, offset, deleteOld } = queryParams;
    return this.seedService.executeSeed(limit, offset, deleteOld);
  }
}
