### ¿Cómo usar?

1) Clonar repositorio: ```git clone https://github.com/budoka/playdigital-api.git```
2) Instalar modulos: ```yarn``` (dentro de la carpeta root del proyecto)
3) Ejecutar aplicación modo desarrollo: ```yarn start```
4) Ejecutar aplicación modo producción: ```yarn ts-build-run```
5) Ejecutar tests: ```yarn test```

### Detalles de la API:

- La API es un wrapper de la API BraveNewCoin (https://rapidapi.com/BraveNewCoin/api/bravenewcoin). 

- La configuración del ambiente (apikey de la API BraveNewCoin, puerto de la app, puerto y hostname de la bbdd, etc) están en el archivo .env. 
- Funciona con MySQL (probado en 8.0.19).
- Documentación y testeo: http://localhost:3000/doc (puerto por defecto).
- Swagger file: http://localhost:3000/swagger (puerto por defecto).

- Todos los endpoints excepto /cryptocurrencies (GET) no requieren autorización.
- Para usar /cryptocurrencies (GET), se debe pasar el token (JWT) que se obtiene de la respuesta de /users/login (POST). Por defecto se genera automáticamente un usuario en la bbdd para probar o sino se puede generar uno.

Usuario de prueba:

**{
  "username": "user12345",
  "password": "user12345"
}**

Debería devolver una respuesta como la siguiente:

**{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhM2VmOGIyLTlkOTktNDA3ZC05NzdlLWEyYzNlM2Y4ZjgwZCIsInVzZXJuYW1lIjoidXNlcjEyMzQ1IiwiY3VycmVuY3kiOiJVU0QiLCJpYXQiOjE1OTY0ODExMDksImV4cCI6MTU5NjQ4MjAwOSwiaXNzIjoicGxheWRpZ2l0YWwtYXBpIn0.SKQGRPKw-tht4L0qNBySCzPMWpr71jiv0w7jE26O8wU"
}**

El token devuelto es el que permite consumir /cryptocurrencies (GET)
