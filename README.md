<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```

3. Tener Nest CLI instalado

```
npm i -g @nest/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```

5.  Clonar el archivo `.env.template`

6.  Iniciar las variables definidas en `.env`.
7.  Ejecutar la aplicaion en dev

```
yarn: start:dev
```

8. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

# Production Build

1. Crear el archivo ``.env.prod`
2. Rellenar variables de entorno prod
3. Crear la nueva imagen

````
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

## Stack usado

- MongoDB
- Nest
````
