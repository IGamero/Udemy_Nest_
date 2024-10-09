import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

// Metodo para manejar excepciones
export const handleExceptions = (error: any) => {
  if (error.code === 11000) {
    throw new BadRequestException({
      message: `Pokemon duplicated`,
      errorLog: error.keyValue,
      error: 'Bad Request',
      statusCode: 400,
    });
  }

  //Lanzar error generico
  console.log(error);
  throw new InternalServerErrorException();
};
