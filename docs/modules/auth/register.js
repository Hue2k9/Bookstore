module.exports = {
  post: {
    tags: ['Auth module'],
    description: 'Register new user',
    operationId: 'register',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateUserDto',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'CREATED',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  $ref: '#/components/schemas/Token',
                },
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      400: {
        $ref: '#/components/responses/BadRequest',
      },
      500: {
        $ref: '#/components/responses/InternalServerError',
      },
    },
  },
};
