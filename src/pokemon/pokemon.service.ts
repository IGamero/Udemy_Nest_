import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId, isString } from 'class-validator';
import { handleExceptions } from 'src/common/utils/handleExceptions';
import { CreatePokemonDto, UpdatePokemonDto } from './dto/index';
import { Pokemon } from './entities/pokemon.entity';
import { dev_setAll_FieldToValue } from 'src/common/utils/dev/dev-utils';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) // Inyecta el modelo a partir del nombre
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemonCreated = await this.pokemonModel.create(createPokemonDto); // Para usar el orm de mongo

      return pokemonCreated;
    } catch (error) {
      // damos la respuesta de error
      handleExceptions(error);
    }
  }

  async findAll() {
    try {
      const allPokemons = await this.pokemonModel.find({ status: true });
      return allPokemons;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(searchTerm: string) {
    try {
      let pokemon: Pokemon;
      let fieldFilter: string;
      // Se podrá buscar por pokemonNumber, por mongoid o por name. filtramos cada caso
      // Si es un numero se filtra por pokemonNumber
      if (!isNaN(+searchTerm)) {
        fieldFilter = 'pokemonNumber';
        pokemon = await this.pokemonModel.findOne({
          [fieldFilter]: searchTerm,
          status: true,
        });
      }

      // Si es un mongoId se filtra por id
      if (!pokemon && isValidObjectId(searchTerm)) {
        fieldFilter = '_id';
        pokemon = await this.pokemonModel.findOne({
          _id: searchTerm,
          status: true,
        });
      }

      // Si es un string se filtra por name
      if (!pokemon && isString(searchTerm) && !isMongoId(searchTerm)) {
        fieldFilter = 'name';
        pokemon = await this.pokemonModel.findOne({
          [fieldFilter]: searchTerm,
          status: true,
        });
      }

      if (!pokemon) {
        throw new NotFoundException({
          statusCode: 404,
          message: `There is no pokemon with ${fieldFilter} ${searchTerm}`,
          field: { [fieldFilter]: searchTerm },
          error: 'Not Found',
          // data: pokemon,
        });
      }

      return pokemon;
    } catch (error) {
      // Si es un error relacionado con Mongoose (por ejemplo, un problema con la conexión)
      if (error instanceof NotFoundException) {
        // No hacemos nada; ya se lanzó la excepción NotFound
        throw error;
      }
      // Captura de errores inesperados
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async update(searchTerm: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const oldPokemon: Pokemon = await this.findOne(searchTerm); // oldpokemon se puede usar ocmo un modelo de mongoose ahora porque tiene todas sus props
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        oldPokemon._id,
        updatePokemonDto,
        { new: true },
      );

      return updatedPokemon;
    } catch (error) {
      handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const pokemon: Pokemon = await this.findOne(id);
      pokemon.status = false;

      // Eliminacion fisica de la db
      // await pokemon.deleteOne();
      // const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id }); // En este caso se borra en usa sola consulta obviando el findOne
      // if (deletedCount === 0) {
      //   throw new BadRequestException(`There is no pokemon with id ${id}`);
      // }

      // Eliminacion logica de la db
      await pokemon.updateOne(pokemon);
      return pokemon;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async dev_setStatusToAll(statusValue) {
    return dev_setAll_FieldToValue(this.pokemonModel, 'status', statusValue);
  }
}
