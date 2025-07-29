import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Room } from '../types';

const addUserToRoomSpy = jest.spyOn(util, 'addUserToRoom');
const populateRoomDocumentSpy = jest.spyOn(util, 'populateRoomDocument');

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

const user1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  username: 'user1_name',
  email: 'user1@email.com',
  pfp: 'pfp1',
  bio: 'I am user1',
};

const user2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  username: 'user2_name',
  email: 'user2@email.com',
  pfp: 'pfp2',
  bio: 'I am user2',
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

describe('GET /getRoomById/:rid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a room object in the response when the room id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqParams = {
      rid: '65e9b5a995b6c7045a30d823',
    };

    const findr = MOCK_ROOMS.filter(r => r._id.toString() === mockReqParams.rid)[0];

    const mockPopulatedRoom = {
      ...findr,
      _id: new mongoose.Types.ObjectId(findr._id),
      chats: findr.chats.map(chat => ({ ...chat, _id: new mongoose.Types.ObjectId(chat._id) })),
    };

    // Provide mock room data
    jest.spyOn(util, 'fetchRoomById').mockResolvedValueOnce(mockPopulatedRoom as Room);

    // Making the request
    const response = await supertest(app).get(`/room/getRoomById/${mockReqParams.rid}`);

    const expectedResponse = {
      ...mockPopulatedRoom,
      _id: mockPopulatedRoom._id.toString(),
      chats: mockPopulatedRoom.chats.map(chat => ({
        ...chat,
        _id: chat._id.toString(),
        chatDateTime: chat.chatDateTime.toISOString(),
      })),
      createDateTime: mockPopulatedRoom.createDateTime.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the room id is not in the correct format', async () => {
    // Mock request parameters
    const mockReqParams = {
      rid: 'invalid id',
    };

    jest.spyOn(util, 'fetchRoomById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/room/getRoomById/${mockReqParams.rid}`);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return database error if the room id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      rid: '65e9b5a995b6c7045a30d111',
    };

    jest.spyOn(util, 'fetchRoomById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/room/getRoomById/${mockReqParams.rid}`);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when fetching the room', async () => {
    // Mock request parameters
    const mockReqParams = {
      rid: '65e9b5a995b6c7045a30d823',
    };

    jest
      .spyOn(util, 'fetchRoomById')
      .mockResolvedValueOnce({ error: 'Error when fetching a room' });

    // Making the request
    const response = await supertest(app).get(`/room/getRoomById/${mockReqParams.rid}`);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('POST /addUserToRoom', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a user to a room successfully', async () => {
    const mockReqBody = {
      rid: MOCK_ROOMS[0]._id,
      user: user1,
    };

    const tempr = MOCK_ROOMS[0];

    const mockPopulatedRoom = {
      ...tempr,
      _id: new mongoose.Types.ObjectId(tempr._id),
      chats: tempr.chats.map(chat => ({ ...chat, _id: new mongoose.Types.ObjectId(chat._id) })),
      users: [...tempr.users, user1.username],
    };

    addUserToRoomSpy.mockResolvedValueOnce(mockPopulatedRoom as Room);
    populateRoomDocumentSpy.mockResolvedValueOnce(mockPopulatedRoom as Room);

    const response = await supertest(app).post('/room/addUserToRoom').send(mockReqBody);

    const expectedResponse = {
      ...mockPopulatedRoom,
      _id: mockPopulatedRoom._id.toString(),
      chats: mockPopulatedRoom.chats.map(chat => ({
        ...chat,
        _id: chat._id.toString(),
        chatDateTime: chat.chatDateTime.toISOString(),
      })),
      createDateTime: mockPopulatedRoom.createDateTime.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the request had rid missing', async () => {
    const mockReqBody = {
      rid: '',
      user: user2,
    };

    const response = await supertest(app).post(`/room/addUserToRoom`).send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if the request had user missing', async () => {
    const mockReqBody = {
      rid: MOCK_ROOMS[0]._id,
      user: '',
    };

    const response = await supertest(app).post(`/room/addUserToRoom`).send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user body');
  });

  it('should return bad request error if the request had invalid user', async () => {
    const mockReqBody = {
      rid: MOCK_ROOMS[0]._id,
      user: { ...user1, username: '' },
    };

    const response = await supertest(app).post(`/room/addUserToRoom`).send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid user body');
  });

  it('should return bad request error if populateRoomDocument fails', async () => {
    const mockReqBody = {
      rid: MOCK_ROOMS[0]._id,
      user: user1,
    };

    const tempr = MOCK_ROOMS[0];

    const mockPopulatedRoom = {
      ...tempr,
      _id: new mongoose.Types.ObjectId(tempr._id),
      chats: tempr.chats.map(chat => ({ ...chat, _id: new mongoose.Types.ObjectId(chat._id) })),
      users: [...tempr.users, user1.username],
    };

    addUserToRoomSpy.mockResolvedValueOnce(mockPopulatedRoom as Room);
    populateRoomDocumentSpy.mockResolvedValueOnce({ error: 'failed to populate' });

    const response = await supertest(app).post('/room/addUserToRoom').send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.text).toEqual('Error when saving room: failed to populate');
  });
});
