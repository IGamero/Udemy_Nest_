import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_DB_CONN: Joi.required,
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().default('develop'),
  SELECT_EXCLUDE: Joi.string().default('-status'),
  API_PREFIX: Joi.string().default('api/v2'),
});
