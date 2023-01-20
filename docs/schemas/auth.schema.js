module.exports = {
  Token: {
    type: 'string',
    description: 'Json web token to authorize user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjIxM2Q3MzE3ZDFmNjhjN2E5YjYzYSIsImlhdCI6MTY2NzM3MTk5MSwiZXhwIjoxNjY4MjM1OTkxfQ.24XHsTs0iLEuL_9Th7yKZn-7tFkskPk01WJWptVivmw',
  },
  CreateUserDto: {
    type: 'object',
    description: 'User DTO',
    properties: {
      name: {
        type: 'string',
        description: 'Name of user',
        example: 'tran.khac.binh.duong@azoom.jp',
      },
      email: {
        type: 'string',
        description: 'Email address of user',
        example: 'tran.khac.binh.duong@azoom.jp',
      },
      password: {
        type: 'string',
        description: 'Password of user',
        example: 'Aa12345678',
      },
    },
  },
  LoginUserDto: {
    type: 'object',
    description: 'Login User DTO',
    properties: {
      email: {
        type: 'string',
        description: 'Email address of user',
        example: 'tran.khac.binh.duong@azoom.jp',
      },
      password: {
        type: 'string',
        description: 'Password of user',
        example: 'Aa12345678',
      },
    },
  },
};
