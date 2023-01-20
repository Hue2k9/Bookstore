module.exports = {
  BadRequest: {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/BadRequest',
        },
      },
    },
  },
  NotFound: {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/NotFound',
        },
      },
    },
  },
  Unauthorized: {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Unauthorized',
        },
      },
    },
  },
  InternalServerError: {
    description: 'InternalServerError',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/InternalServerError',
        },
      },
    },
  },
};
