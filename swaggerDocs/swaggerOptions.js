const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'FilmAPI',
      description: 'API for site of movie information',
      contact: {
        name: 'R1337',
      },
      servers: ['https://filmapi0.herokuapp.com'],
    },
    host: 'filmapi0.herokuapp.com',
    tags: [
      {
        name: 'Favourites',
        description: 'Api for favourites',
      },
      {
        name: 'Auth',
        description: 'Api for authorization',
      },
      {
        name: 'Me',
        description: 'Api to verify user existence',
      },
      {
        name: 'Random film',
        description: 'Api to get a random movie from the top 100 imdb',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // ['.routes/*.js']
  apis: ['./swaggerDocs/*.js'],
};

module.exports = swaggerOptions;
