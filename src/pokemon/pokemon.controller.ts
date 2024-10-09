import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // Cada endpoint tiene por defecto uno codigo de respuesta, en este caso es 201
  // Se puede poner el codigo directamente o usar "HttpStatus"
  // @HttpCode(200) // Permite  cambiar el codigo de error por el que queramos.
  // @HttpCode(HttpStatus.OK) // Es lo mismo que "200". HttpStatus es un enum con todos los valores
  @HttpCode(HttpStatus.CREATED) // NO ES NECESARIO PONERLO, porque es el valor default
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    const pokemon: Pokemon = await this.pokemonService.create(createPokemonDto);
    return {
      statusCode: 200,
      message: 'createPokemon',
      data: pokemon,
    };
  }

  @Get()
  async findAll() {
    const allPokemons: Pokemon[] = await this.pokemonService.findAll();
    if (allPokemons.length === 0) {
      return {
        statusCode: 200,
        message: `Table 'pokemons' is empty.`,
        data: allPokemons,
      };
    }

    return {
      statusCode: 200,
      message: 'getAllPokemons',
      total: allPokemons.length,
      data: allPokemons,
    };
  }

  @Get(':searchTerm')
  async findOne(@Param('searchTerm') searchTerm: string) {
    const pokemon: Pokemon = await this.pokemonService.findOne(searchTerm);
    return {
      statusCode: 200,
      message: 'getPokemon',
      data: pokemon,
    };
  }

  @Patch(':searchTerm')
  async update(
    @Param('searchTerm') searchTerm: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    const pokemon: Pokemon = await this.pokemonService.update(
      searchTerm,
      updatePokemonDto,
    );
    return {
      statusCode: 200,
      message: 'updatePokemon',
      data: pokemon,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    const pokemon: Pokemon = await this.pokemonService.remove(id);
    const { status, ...rest } = pokemon.toJSON();
    return {
      statusCode: 200,
      message: 'deletePokemon',
      data: { ...rest, DELETED: true },
    };
  }

  @Put(':status')
  async all(@Param('status') status: boolean) {
    const result = await this.pokemonService.dev_setStatusToAll(status);
    return result;
  }
}
