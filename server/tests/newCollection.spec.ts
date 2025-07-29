import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Collection, Question } from '../types';

const mockCollection: Collection = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
  name: 'New Collection Name',
  user: 'collection_user',
  createdAt: new Date('2024-06-06'),
  questions: [],
};

const simplifyCollection = (collection: Collection) => ({
  ...collection,
  _id: collection._id?.toString(), // Converting ObjectId to string
  questions: collection.questions.map(question => ({
    ...question,
    _id: question._id?.toString(),
    askDateTime: (question as Question).askDateTime.toISOString(),
  })),
  createdAt: collection.createdAt.toISOString(),
});

describe('POST /addCollection', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new collection', async () => {
    jest.spyOn(util, 'saveCollection').mockResolvedValueOnce(mockCollection as Collection);
    jest
      .spyOn(util, 'populateCollectionDocument')
      .mockResolvedValueOnce(mockCollection as Collection);

    // Making the request
    const response = await supertest(app).post('/collection/addCollection').send(mockCollection);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(simplifyCollection(mockCollection));
  });

  it('should return 500 if error occurs in `saveCollection` while adding a new collection', async () => {
    jest
      .spyOn(util, 'saveCollection')
      .mockResolvedValueOnce({ error: 'Error when saving collection' });

    // Making the request
    const response = await supertest(app).post('/collection/addCollection').send(mockCollection);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return 500 if error occurs in `saveCollection` while adding a new collection', async () => {
    jest.spyOn(util, 'saveCollection').mockResolvedValueOnce(mockCollection as Collection);
    jest
      .spyOn(util, 'populateCollectionDocument')
      .mockResolvedValueOnce({ error: 'Error while populating' });

    // Making the request
    const response = await supertest(app).post('/collection/addCollection').send(mockCollection);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request if collection name is empty string', async () => {
    // Making the request
    const response = await supertest(app)
      .post('/collection/addCollection')
      .send({ ...mockCollection, name: '' });

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid collection body');
  });

  it('should return bad request if user is empty string', async () => {
    // Making the request
    const response = await supertest(app)
      .post('/collection/addCollection')
      .send({ ...mockCollection, user: '' });

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid collection body');
  });

  it('should return bad request if questions are undefined', async () => {
    // Making the request
    const response = await supertest(app)
      .post('/collection/addCollection')
      .send({ ...mockCollection, questions: undefined });

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid collection body');
  });
});
