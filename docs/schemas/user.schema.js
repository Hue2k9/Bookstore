module.exports = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'ObjectId',
        description: 'User identification number',
        example: '63390ffb769306d131512c00',
      },
      name: {
        type: 'string',
        description: 'User name',
        example: 'tran.khac.binh.duong@azoom.jp',
      },
      email: {
        type: 'string',
        description: 'User email',
        example: 'tran.khac.binh.duong@azoom.jp',
      },
      avatar: {
        type: 'string',
        description: 'User avatar',
        example: 'avatars/tran.khac.binh.duong@azoom.jp.png',
      },
      role: {
        type: 'string',
        description: 'User role',
        example: 'user',
      },
    },
    required: ['name', 'email'],
  },
};
