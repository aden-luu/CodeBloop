import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import UserModel from '../models/users';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const findOneSpy = jest.spyOn(UserModel, 'findOne');

describe('User Controller', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /getUser', () => {
    it('should retrieve a user by username', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'testuser',
        email: 'testuser@example.com',
        pfp: 'pfp1',
        bio: 'bio1',
      };

      findOneSpy.mockResolvedValueOnce(mockUser);

      const response = await supertest(app).get('/user/getUser').query({ username: 'testuser' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockUser._id.toString(),
        username: 'testuser',
        email: 'testuser@example.com',
        pfp: 'pfp1',
        bio: 'bio1',
      });
    });

    it('should return a 400 error if username is missing', async () => {
      const response = await supertest(app).get('/user/getUser').query({});

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid username requesting question.');
    });

    it('should return a 500 error if there is a database error', async () => {
      findOneSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app).get('/user/getUser').query({ username: 'testuser' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when fetching user by username: Database error');
    });

    it('should return a 500 error if there is any error', async () => {
      findOneSpy.mockRejectedValueOnce('wjkef');

      const response = await supertest(app).get('/user/getUser').query({ username: 'testuser' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when fetching user by username');
    });
  });

  describe('POST /addUser', () => {
    it('should add a new user', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        pfp: 'pfp1',
        bio: 'bio1',
      };

      saveUserSpy.mockResolvedValueOnce({ ...mockUser, _id: new mongoose.Types.ObjectId() });

      const response = await supertest(app).post('/user/addUser').send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockUser);
    });

    it('should return a 400 error if user data is invalid', async () => {
      const invalidUser = { username: '' };

      const response = await supertest(app).post('/user/addUser').send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid user body');
    });

    it('should return a 500 error if saveUser fails', async () => {
      saveUserSpy.mockRejectedValueOnce(new Error('Failed to save user'));

      const validUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        pfp: 'pfp1',
        bio: 'bio1',
      };

      const response = await supertest(app).post('/user/addUser').send(validUser);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when saving user: Failed to save user');
    });
  });
});
