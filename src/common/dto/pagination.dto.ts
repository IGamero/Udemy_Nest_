// import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  // @Type(() => Number) // Lo transformarmos en la conversion de pipes en main
  @IsNumber()
  @Min(10, { message: 'limit must not be less than 10' })
  limit?: number;

  @IsOptional()
  @Min(0)
  // @Type(() => Number) // Lo transformarmos en la conversion de pipes en main
  @IsNumber()
  @IsInt()
  offset?: number = 0;
}
