<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Paso a paso para levantar el proyecto

1. Clonar el repositorio.
2. Ejecutar
```
yarn install
```
3. Tener Nest cli instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos con docker
```
docker-compose up -d
```
5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llnear las variables de entorno definidas en el archivo __.env__
7. Ejecutar la aplicacion en desarrollo:
```
yarn start:dev
```
8. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```

## Stack Usado
Nestjs
Docker
Mongo DB

