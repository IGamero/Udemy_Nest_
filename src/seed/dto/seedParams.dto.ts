import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsBoolean, IsPositive } from 'class-validator';

export class SeedParamsDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @Min(10, { message: 'limit must not be less than 10' })
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @IsInt()
  offset: number = 0;

  @Type(() => Boolean)
  @IsBoolean()
  deleteOld: boolean = false;
}
