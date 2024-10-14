export const EnvConfig = () => ({
  // Inicializa variables de entorno en caso de no existir
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGO_DB_CONN,
  port: process.env.PORT || '3000',
  apiPrefix: process.env.API_PREFIX || 'api/v2',
  selectExclude: process.env.SELECT_EXCLUDE || '',
});
