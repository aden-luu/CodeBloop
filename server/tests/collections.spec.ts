import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';

const getCollectionsByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getCollectionsByOrder');
const deleteCollectionSpy: jest.SpyInstance = jest.spyOn(util, 'deleteCollection');

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1',
  description: 'tag1 description',
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2',
  description: 'tag2 description',
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ansBy: 'answer1_user',
  ansDateTime: '2024-06-09',
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ansBy: 'answer2_user',
  ansDateTime: '2024-06-10',
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans3 = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'Answer 3 Text',
  ansBy: 'answer3_user',
  ansDateTime: '2024-06-11',
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans4 = {
  _id: '65e9b58910afe6e94fc6e6dg',
  text: 'Answer 4 Text',
  ansBy: 'answer4_user',
  ansDateTime: '2024-06-14',
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const MOCK_QUESTIONS = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    askedBy: 'question2_user',
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: '34e9b58910afe6e94fc6e99f',
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    askedBy: 'question3_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const MOCK_COLLECTIONS = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    name: 'Want to Learn',
    user: 'collection_by1',
    questions: [MOCK_QUESTIONS[0], MOCK_QUESTIONS[1]],
    createdAt: new Date('2023-11-16T09:24:00'),
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    name: 'Miscellaneous',
    user: 'collection_by2',
    questions: [MOCK_QUESTIONS[1], MOCK_QUESTIONS[2]],
    createdAt: new Date('2023-11-16T09:25:00'),
  },
  {
    _id: '65e9b9b44c052f0a08ecade0',
    name: 'All',
    user: 'collection_by1',
    questions: MOCK_QUESTIONS,
    createdAt: new Date('2023-11-16T09:24:00'),
  },
  {
    _id: '65e9b716ff0e892116b2de09',
    name: 'Unknown',
    user: 'collection_by1',
    questions: [MOCK_QUESTIONS[2]],
    createdAt: new Date('2023-11-16T09:24:00'),
  },
];

const EXPECTED_COLLECTIONS = MOCK_COLLECTIONS.map(collection => ({
  ...collection,
  _id: collection._id.toString(),
  questions: collection.questions.map(question => ({
    ...question,
    _id: question._id.toString(),
    tags: question.tags.map(tag => ({ ...tag, _id: tag._id.toString() })),
    askDateTime: question.askDateTime.toISOString(),
    answers: question.answers.map(answer => ({
      ...answer,
      _id: answer._id.toString(),
      ansDateTime: answer.ansDateTime,
    })),
  })),
  createdAt: collection.createdAt.toISOString(),
}));

describe('GET /getCollection', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the result of getCollectionsByOrder as response even if request parameters of order is absent', async () => {
    const mockQueryParams = {
      order: '',
      user: 'dummyUser',
    };

    getCollectionsByOrderSpy.mockResolvedValueOnce(MOCK_COLLECTIONS);
    // Making the request
    const response = await supertest(app).get('/collection/getCollection').query(mockQueryParams);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_COLLECTIONS);
  });

  it('should return the result of getCollectionsByOrder as response for an order criterion in the request parameters', async () => {
    // Mock request query parameters
    const mockQueryParams = {
      order: 'dummyOrder',
      user: 'dummyUser',
    };

    getCollectionsByOrderSpy.mockResolvedValueOnce(MOCK_COLLECTIONS);
    // Making the request
    const response = await supertest(app).get('/collection/getCollection').query(mockQueryParams);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_COLLECTIONS);
  });

  it('should return error if getCollectionsByOrder throws an error', async () => {
    // Mock request query parameters
    const mockQueryParams = {
      order: 'dummyOrder',
      user: 'dummyUser',
    };

    getCollectionsByOrderSpy.mockRejectedValueOnce(new Error('Error fetching collections'));
    // Making the request
    const response = await supertest(app).get('/collection/getCollection').query(mockQueryParams);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return error if user param is invalid', async () => {
    // Mock request query parameters
    const mockQueryParams = {
      order: 'dummyOrder',
      user: '',
    };

    // Making the request
    const response = await supertest(app).get('/collection/getCollection').query(mockQueryParams);

    // Asserting the response
    expect(response.status).toBe(400);
  });
});

describe('POST /deleteCollection/:cid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should delete a collection object from the list of collections', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: MOCK_COLLECTIONS[0]._id.toString(),
    };

    const mockReqBody = {
      user: 'collection_by1',
    };

    deleteCollectionSpy.mockResolvedValueOnce(MOCK_COLLECTIONS.splice(0, 1));

    // Making the request
    const response = await supertest(app)
      .post(`/collection/deleteCollection/${mockReqParams.cid}`)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_COLLECTIONS.splice(0, 1));
  });

  it('should return error if deleteCollection throws an error', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: MOCK_COLLECTIONS[0]._id.toString(),
    };

    const mockReqBody = {
      user: 'collection_by1',
    };

    deleteCollectionSpy.mockRejectedValueOnce(new Error('Error deleting collection'));
    // Making the request
    const response = await supertest(app)
      .post(`/collection/deleteCollection/${mockReqParams.cid}`)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request error if the collection id is not in the correct format', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: 'invalid id',
    };

    const mockReqBody = {
      user: 'collection_by1',
    };

    // Making the request
    const response = await supertest(app)
      .post(`/collection/deleteCollection/${mockReqParams.cid}`)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return bad request error if the username is invalid', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: MOCK_COLLECTIONS[0]._id.toString(),
    };

    const mockReqBody = {
      user: '',
    };

    // Making the request
    const response = await supertest(app)
      .post(`/collection/deleteCollection/${mockReqParams.cid}`)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid username');
  });

  it('should return database error if the collection id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: '65e9b5a995b6c7045a30d823',
    };

    const mockReqBody = {
      user: 'collection_by1',
    };

    jest.spyOn(util, 'fetchCollectionByUser').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app)
      .post(`/collection/deleteCollection/${mockReqParams.cid}`)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});
