import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';

const getRoomsByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getRoomsByOrder');
const filterRoomsBySearchSpy: jest.SpyInstance = jest.spyOn(util, 'filterRoomsBySearch');

const chat1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Chat 1 Text',
  typedBy: 'chat_1_user',
  chatDateTime: new Date('2024-06-09'),
};

const chat2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Chat 2 Text',
  typedBy: 'chat_2_user',
  chatDateTime: new Date('2024-06-09'),
};

const chat3 = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'Chat 3 Text',
  typedBy: 'chat_3_user',
  chatDateTime: new Date('2024-06-09'),
};

const MOCK_ROOMS = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    name: 'Chat Room 1 Title',
    users: ['chat_1_user', 'chat_2_user', 'chat_3_user'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2024-01-01'),
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    name: 'Chat Room 2 Title',
    users: ['chat_1_user', 'chat_2_user', 'chat_3_user'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2024-01-01'),
  },
  {
    _id: '34e9b58910afe6e94fc6e99f',
    name: 'Chat Room 3 Title',
    users: ['chat_1_user', 'chat_2_user', 'chat_3_user'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2024-01-01'),
  },
];

const EXPECTED_ROOMS = MOCK_ROOMS.map(room => ({
  ...room,
  _id: room._id?.toString(), // Converting ObjectId to string
  chats: room.chats.map(chat => ({
    ...chat,
    _id: chat._id?.toString(),
    chatDateTime: chat.chatDateTime.toISOString(),
  })), // Converting chat ObjectId
  createDateTime: room.createDateTime.toISOString(),
}));

describe('GET /getRoom', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the result of filterRoomsBySearch as response even if request parameters of order and search are absent', async () => {
    getRoomsByOrderSpy.mockResolvedValueOnce(MOCK_ROOMS);
    filterRoomsBySearchSpy.mockReturnValueOnce(MOCK_ROOMS);
    // Making the request
    const response = await supertest(app).get('/room/getRoom');

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_ROOMS);
  });

  it('should return the result of filterRoomsBySearch as response for an order and search criteria in the request parameters', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getRoomsByOrderSpy.mockResolvedValueOnce(MOCK_ROOMS);
    filterRoomsBySearchSpy.mockReturnValueOnce(MOCK_ROOMS);
    // Making the request
    const response = await supertest(app).get('/room/getRoom').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_ROOMS);
  });

  it('should return error if getRoomsByOrder throws an error', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getRoomsByOrderSpy.mockRejectedValueOnce(new Error('Error fetching rooms'));
    // Making the request
    const response = await supertest(app).get('/room/getRoom').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return error if filterRoomsBySearch throws an error', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getRoomsByOrderSpy.mockResolvedValueOnce(MOCK_ROOMS);
    filterRoomsBySearchSpy.mockRejectedValueOnce(new Error('Error filtering rooms'));
    // Making the request
    const response = await supertest(app).get('/room/getRoom').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});
