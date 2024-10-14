import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

// import * as dotenv from 'dotenv';

// dotenv.config();
@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      load: [EnvConfig], // Inicializan las variables de entorno
      validationSchema: JoiValidationSchema, // Mapea y valida las variables de entorno. // Prioriza este sobre envConfig
    }),

    // Sirve a la llamada directa del server al conenido estatico de la carpeta public
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),

    // Inicia la conexion de la bd de mongo
    MongooseModule.forRoot(process.env.MONGO_DB_CONN), // crea la conexión a bbdd

    // Modulos importados del resto de la app
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {
  constructor() {
    // console.log(process.env);
  }
}
