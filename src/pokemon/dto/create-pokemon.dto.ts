import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  pokemonNumber: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
