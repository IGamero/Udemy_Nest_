import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/http-adapters/axios.adapter';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { SeedParamsDto } from './dto/seedParams.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly pokemonService: PokemonService,
    private readonly httpAdapter: AxiosAdapter,
  ) {}

  async executeSeed(queryParams: SeedParamsDto) {
    const { limit, offset, deleteOld } = queryParams;
    const paginationDto: PaginationDto = { limit, offset };
    try {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

      const data: PokeResponse = await this.httpAdapter.get(url);

      const formatedData: CreatePokemonDto[] = data.results.map(
        ({ name, url }) => {
          const segments = url.split('/');
          const pokemonNumber: number = +segments[segments.length - 2];
          const pokemonDto: CreatePokemonDto = {
            pokemonNumber,
            name,
          };
          return pokemonDto;
        },
      );

      // Podemos optar por BORRAR todo lo que ya tenemos
      if (deleteOld) await this.pokemonModel.deleteMany(); // Borra todo lo que haya

      const currentPokemons: Pokemon[] = await this.pokemonModel.find();
      const pokemonsToInsert: CreatePokemonDto[] = [];

      formatedData.forEach((pokemon: CreatePokemonDto) => {
        const existPokemon = currentPokemons.find(
          ({ name, pokemonNumber }) =>
            name === pokemon.name || pokemonNumber === pokemon.pokemonNumber,
        );
        if (!existPokemon) {
          pokemonsToInsert.push(pokemon);
        }
      });

      const insertedPokemons: Pokemon[] =
        await this.pokemonModel.insertMany(pokemonsToInsert);

      const count = insertedPokemons.length;
      return {
        count,
        msg: `Inserted ${count} pokemons into 'Pokemons' table using SEED`,
        data: insertedPokemons,
      };
    } catch (error) {
      console.error('Error fetching data from PokeAPI', error);
      throw new Error('Failed to execute seed');
    }
  }
}
