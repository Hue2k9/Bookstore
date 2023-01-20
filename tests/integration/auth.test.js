const request = require('supertest');
const httpStatus = require('http-status');

const { User } = require('../../models');
const app = require('../../app');
const setupTestDB = require('../utils/setupTestDB');
const { mockUser } = require('../mocks/auth.mock');

setupTestDB();

describe('Auth routes', () => {
  describe('POST /api/v1/auth/register', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: 'test user',
        email: 'test@gmail.com',
        password: 'Password123',
      };
    });

    test('should return 201 and create new user if request data is ok', async () => {
      const apiUrl = '/api/v1/auth/register';
      const {
        body: { user, accessToken },
        statusCode,
      } = await request(app).post(apiUrl).send(newUser);

      expect(statusCode).toEqual(httpStatus.CREATED);
      expect(accessToken).toBeDefined();
      expect(user).not.toHaveProperty('password');
      expect(user).toEqual({
        id: expect.anything(),
        name: newUser.name,
        email: newUser.email,
        role: 'user',
        active: true,
        avatar: 'default-avatar.jpg',
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await User.create(mockUser);
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    test('should return 200 and login user if email and password match', async () => {
      const loginCredentials = {
        email: mockUser.email,
        password: mockUser.password,
      };

      const apiUrl = '/api/v1/auth/login';

      const {
        body: { user, accessToken },
        statusCode,
      } = await request(app).post(apiUrl).send(loginCredentials);

      expect(statusCode).toEqual(httpStatus.OK);
      expect(accessToken).toBeDefined();
      expect(user).toEqual({
        id: expect.anything(),
        name: mockUser.name,
        email: mockUser.email,
        role: 'user',
        avatar: 'default-avatar.jpg',
      });
    });
  });
});
