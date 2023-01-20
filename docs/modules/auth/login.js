module.exports = {
  post: {
    tags: ['Auth module'],
    description: 'Login user',
    operationId: 'login',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginUserDto',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'ok',
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
