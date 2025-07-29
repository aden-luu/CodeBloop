import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Room } from '../types';

const saveChatSpy = jest.spyOn(util, 'saveChat');
const addChatSpy = jest.spyOn(util, 'addChat');
const popRoomDocSpy = jest.spyOn(util, 'populateRoomDocument');

describe('POST /addChat', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new chat to the room', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const mockChat = {
      _id: validCid,
      text: 'This is a test chat',
      typedBy: 'TestUser1',
      chatDateTime: new Date('2024-06-03'),
    };

    saveChatSpy.mockResolvedValueOnce(mockChat);

    addChatSpy.mockResolvedValueOnce({
      _id: validRid,
      name: 'Test Chat Room',
      users: ['TestUser1'],
      chats: [mockChat._id],
      createDateTime: new Date('2024-01-01'),
    } as Room);

    popRoomDocSpy.mockResolvedValueOnce({
      _id: validRid,
      name: 'Test Chat Room',
      users: ['TestUser1'],
      chats: [mockChat],
      createDateTime: new Date('2024-01-01'),
    });

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validCid.toString(),
      text: 'This is a test chat',
      typedBy: 'TestUser1',
      chatDateTime: '2024-06-03T00:00:00.000Z',
    });
  });

  it('should throw if a user who is not in the room tries to add a new chat to the room', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'dummyUserId',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const mockChat = {
      _id: validCid,
      text: 'This is a test chat',
      typedBy: 'dummyUserId',
      chatDateTime: new Date('2024-06-03'),
    };

    saveChatSpy.mockResolvedValueOnce(mockChat);

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when adding chat: Error when adding chat to chat room: User is not part of this chat room, cannot add chat to this room',
    );
  });

  it('should return bad request error if room property missing', async () => {
    const mockReqBody = {
      chat: {
        text: 'This is a test chat',
        typedBy: 'dummyUserId',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if chat property is missing', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if chat text property is missing', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if text property of chat is empty', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: '',
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid chat body');
  });

  it('should return bad request error if typedBy property missing', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if chatDateTime property missing', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'TestUser1',
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/chat/addChat');

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return bad request error if rid is not a valid ObjectId', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: 'invalidObjectId',
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return database error in response if saveChat method throws an error', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    saveChatSpy.mockResolvedValueOnce({ error: 'Error when saving a chat' });

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding chat: Error when saving a chat');
  });

  it('should return database error in response if `addChat` method throws an error', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const mockChat = {
      _id: validCid,
      text: 'This is a test chat',
      typedBy: 'TestUser1',
      chatDateTime: new Date('2024-06-03'),
    };

    saveChatSpy.mockResolvedValueOnce(mockChat);
    addChatSpy.mockResolvedValueOnce({
      error: 'Error when adding chat to chat room',
    });

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding chat: Error when adding chat to chat room');
  });

  it('should return database error in response if `populateRoomDocument` method throws an error', async () => {
    const validRid = new mongoose.Types.ObjectId();
    const validCid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      id: validRid,
      room: {
        id: validRid.toString(),
        name: 'Test Chat Room',
        users: ['TestUser1'],
        chats: [],
        createDateTime: new Date('2024-01-01'),
      },
      chat: {
        text: 'This is a test chat',
        typedBy: 'TestUser1',
        chatDateTime: new Date('2024-06-03'),
      },
    };

    const mockChat = {
      _id: validCid,
      text: 'This is a test chat',
      typedBy: 'TestUser1',
      chatDateTime: new Date('2024-06-03'),
    };

    const mockRoom = {
      id: validRid.toString(),
      name: 'Test Chat Room',
      users: ['TestUser1'],
      chats: [],
      createDateTime: new Date('2024-01-01'),
    };

    saveChatSpy.mockResolvedValueOnce(mockChat);
    addChatSpy.mockResolvedValueOnce(mockRoom);
    popRoomDocSpy.mockResolvedValueOnce({ error: 'Error when populating room document' });

    const response = await supertest(app).post('/chat/addChat').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding chat: Error when populating room document');
  });
});
