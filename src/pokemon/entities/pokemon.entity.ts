import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// Document añade todo lo necesario para usar la entidad con mongoose
@Schema() // Decorador que indica que esto es un esquema
export class Pokemon extends Document {
  //   id: string; // viene de mongo

  //   Añadimos propiedades al registro de la entidad
  @Prop({
    unique: true, // El registro "name" es unico
    index: true, // El registro tiene un index asociado
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  pokemonNumber: number;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

PokemonSchema.set('toJSON', {
  transform: (doc, ret) => {
    const { __v, ...rest } = ret; // Se excluye de la respuesta "__v"
    return rest;
  },
});
