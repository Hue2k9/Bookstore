module.exports = {
  NotFound: {
    type: 'object',
    description: 'NotFound',
    properties: {
      code: {
        type: 'int',
        description: 'Status code of response',
        example: 404,
      },
      message: {
        type: 'string',
        description: 'Message of response',
        example: 'NotFound',
      },
    },
  },
  BadRequest: {
    type: 'object',
    description: 'BadRequest',
    properties: {
      code: {
        type: 'int',
        description: 'Status code of response',
        example: 400,
      },
      message: {
        type: 'string',
        description: 'Message of response',
        example: 'BadRequest',
      },
    },
  },
  InternalServerError: {
    type: 'object',
    description: 'InternalServerError',
    properties: {
      code: {
        type: 'int',
        description: 'Status code of response',
        example: 500,
      },
      message: {
        type: 'string',
        description: 'Message of response',
        example: 'InternalServerError',
      },
    },
  },
  Unauthorized: {
    type: 'object',
    description: 'Unauthorized',
    properties: {
      code: {
        type: 'int',
        description: 'Status code of response',
        example: 401,
      },
      message: {
        type: 'string',
        description: 'Message of response',
        example: 'Unauthorized',
      },
    },
  },
};
