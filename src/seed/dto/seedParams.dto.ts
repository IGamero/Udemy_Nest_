import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsBoolean, IsNumber } from 'class-validator';

export class SeedParamsDto {
  @IsOptional()
  @IsNumber()
  // @Type(() => Number)
  @Min(10, { message: 'limit must not be less than 10' })
  @IsInt()
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  // @Type(() => Number)
  @Min(0, { message: 'limit must not be less than 10' })
  @IsInt()
  offset?: number = 0;

  @IsOptional()
  // @Type(() => Boolean)
  @IsBoolean()
  deleteOld?: boolean = false;
}
