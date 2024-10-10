import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly pokemonService: PokemonService,
  ) {}

  private readonly axios: AxiosInstance = axios;

  async executeSeed(limit: number, offset: number, deleteOld: boolean) {
    try {
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });

      const { data } = await this.axios.get<PokeResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        { httpsAgent: agent },
      );

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

      const currentPokemons: Pokemon[] = await this.pokemonService.findAll();
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
