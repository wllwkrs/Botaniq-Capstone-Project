
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const userRoutes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5500,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:8080', 'https://previously-notable-hound.ngrok-free.app', 'https://saria4558.github.io'],  
        additionalHeaders: ['cache-control', 'x-requested-with', 'authorization', 'content-type'],
        maxAge: 86400,
        credentials: true
      },
      payload: {
        parse: true,
        allow: 'application/json'
      }
    }
  });

  await server.register(Jwt);
  await server.register(Inert);

  server.auth.strategy('jwt', 'jwt', {
    keys: 'your_secret_key',
    verify: { aud: false, iss: false, sub: false, nbf: true },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: artifacts.decoded.payload
      };
    }
  });

  server.route(userRoutes);

 
  server.ext('onRequest', (request, h) => {
    console.log(`${request.method.toUpperCase()} ${request.path}`);
    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
