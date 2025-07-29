import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Chat, Room } from '../types';

const chat1: Chat = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  text: 'Test Chat 1',
  typedBy: 'TestUser1',
  chatDateTime: new Date('2024-06-06'),
};
const chat2: Chat = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  text: 'Test Chat 2',
  typedBy: 'TestUser2',
  chatDateTime: new Date('2024-06-06'),
};

const mockRoom: Room = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
  name: 'New Chat Room Title',
  users: ['TestUser1', 'TestUser2'],
  chats: [chat1, chat2],
  createDateTime: new Date('2024-01-01'),
};

const simplifyRoom = (room: Room) => ({
  ...room,
  _id: room._id?.toString(), // Converting ObjectId to string
  chats: room.chats.map(chat => ({
    ...chat,
    _id: chat._id?.toString(),
    chatDateTime: (chat as Chat).chatDateTime.toISOString(),
  })),
  createDateTime: room.createDateTime.toISOString(),
});

describe('POST /addRoom', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new chat room', async () => {
    jest.spyOn(util, 'saveRoom').mockResolvedValueOnce(mockRoom as Room);
    jest.spyOn(util, 'populateRoomDocument').mockResolvedValueOnce(mockRoom as Room);

    // Making the request
    const response = await supertest(app).post('/room/addRoom').send(mockRoom);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(simplifyRoom(mockRoom));
  });

  it('should return 500 if error occurs in `saveRoom` while adding a new room', async () => {
    jest.spyOn(util, 'saveRoom').mockResolvedValueOnce({ error: 'Error when saving a room' });

    // Making the request
    const response = await supertest(app).post('/room/addRoom').send(mockRoom);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return 500 if error occurs in `saveRoom` while adding a new room', async () => {
    jest.spyOn(util, 'saveRoom').mockResolvedValueOnce(mockRoom as Room);
    jest
      .spyOn(util, 'populateRoomDocument')
      .mockResolvedValueOnce({ error: 'Error while populating' });

    // Making the request
    const response = await supertest(app).post('/room/addRoom').send(mockRoom);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request if room name is empty string', async () => {
    // Making the request
    const response = await supertest(app)
      .post('/room/addRoom')
      .send({ ...mockRoom, name: '' });

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid room body');
  });
});
