import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Collection } from '../types';

const addQuestionToCollectionSpy = jest.spyOn(util, 'addQuestionToCollection');
const removeQuestionFromCollectionSpy = jest.spyOn(util, 'removeQuestionFromCollection');
const renameCollectionSpy = jest.spyOn(util, 'renameCollection');
const populateCollectionDocumentSpy = jest.spyOn(util, 'populateCollectionDocument');

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
    questions: [MOCK_QUESTIONS[1], MOCK_QUESTIONS[3]],
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
    questions: [MOCK_QUESTIONS[3]],
    createdAt: new Date('2023-11-16T09:24:00'),
  },
];

describe('POST /addQuestionToCollection', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a question to collection successfully', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      question: MOCK_QUESTIONS[0],
    };

    const tempc = MOCK_COLLECTIONS[0];

    const mockPopulatedCollection = {
      ...tempc,
      _id: new mongoose.Types.ObjectId(tempc._id),
      questions: tempc.questions.map(question => ({
        ...question,
        _id: new mongoose.Types.ObjectId(question._id),
        tags: question.tags.map(tag => ({ ...tag, _id: new mongoose.Types.ObjectId(tag._id) })),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: new mongoose.Types.ObjectId(answer._id),
          ansDateTime: new Date(answer.ansDateTime),
        })),
      })),
    };

    addQuestionToCollectionSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);
    populateCollectionDocumentSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);

    const response = await supertest(app)
      .post('/collection/addQuestionToCollection')
      .send(mockReqBody);

    const expectedResponse = {
      ...mockPopulatedCollection,
      _id: mockPopulatedCollection._id.toString(),
      questions: mockPopulatedCollection.questions.map(question => ({
        ...question,
        _id: question._id.toString(),
        tags: question.tags.map(tag => ({ ...tag, _id: tag._id.toString() })),
        askDateTime: question.askDateTime.toISOString(),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: answer._id.toString(),
          ansDateTime: new Date(answer.ansDateTime).toISOString(),
        })),
      })),
      createdAt: mockPopulatedCollection.createdAt.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the request had cid missing', async () => {
    const mockReqBody = {
      question: MOCK_QUESTIONS[0],
    };

    const response = await supertest(app)
      .post('/collection/addQuestionToCollection')
      .send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if the request had question missing', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      question: '',
    };

    const response = await supertest(app)
      .post('/collection/addQuestionToCollection')
      .send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should throw error if populateCollectionDocument returns an error', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      question: MOCK_QUESTIONS[0],
    };

    const tempc = MOCK_COLLECTIONS[0];

    const mockPopulatedCollection = {
      ...tempc,
      _id: new mongoose.Types.ObjectId(tempc._id),
      questions: tempc.questions.map(question => ({
        ...question,
        _id: new mongoose.Types.ObjectId(question._id),
        tags: question.tags.map(tag => ({ ...tag, _id: new mongoose.Types.ObjectId(tag._id) })),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: new mongoose.Types.ObjectId(answer._id),
          ansDateTime: new Date(answer.ansDateTime),
        })),
      })),
    };

    addQuestionToCollectionSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);
    populateCollectionDocumentSpy.mockResolvedValueOnce({ error: 'Error while populating' });

    const response = await supertest(app)
      .post('/collection/addQuestionToCollection')
      .send(mockReqBody);

    expect(response.status).toBe(500);
  });
});

describe('POST /removeQuestionFromCollection', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should remove a question from collection successfully', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      question: MOCK_QUESTIONS[0],
    };

    const tempc = MOCK_COLLECTIONS[0];
    const tempq = MOCK_QUESTIONS[1];

    const mockPopulatedCollection = {
      ...tempc,
      _id: new mongoose.Types.ObjectId(tempc._id),
      questions: [
        {
          ...tempq,
          _id: new mongoose.Types.ObjectId(tempq._id),
          tags: tempq.tags.map(tag => ({ ...tag, _id: new mongoose.Types.ObjectId(tag._id) })),
          askDateTime: tempq.askDateTime,
          answers: tempq.answers.map(answer => ({
            ...answer,
            _id: new mongoose.Types.ObjectId(answer._id),
            ansDateTime: new Date(answer.ansDateTime),
          })),
        },
      ],
    };

    removeQuestionFromCollectionSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);
    populateCollectionDocumentSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);

    const response = await supertest(app)
      .post('/collection/removeQuestionFromCollection')
      .send(mockReqBody);

    const expectedResponse = {
      ...mockPopulatedCollection,
      _id: mockPopulatedCollection._id.toString(),
      questions: mockPopulatedCollection.questions.map(question => ({
        ...question,
        _id: question._id.toString(),
        tags: question.tags.map(tag => ({ ...tag, _id: tag._id.toString() })),
        askDateTime: question.askDateTime.toISOString(),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: answer._id.toString(),
          ansDateTime: new Date(answer.ansDateTime).toISOString(),
        })),
      })),
      createdAt: mockPopulatedCollection.createdAt.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the request had cid missing', async () => {
    const mockReqBody = {
      question: MOCK_QUESTIONS[0],
    };

    const response = await supertest(app)
      .post('/collection/removeQuestionFromCollection')
      .send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if the request had question missing', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      question: '',
    };

    const response = await supertest(app)
      .post('/collection/removeQuestionFromCollection')
      .send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should throw error if populateCollectionDocument returns an error', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      question: MOCK_QUESTIONS[0],
    };

    const tempc = MOCK_COLLECTIONS[0];
    const tempq = MOCK_QUESTIONS[1];

    const mockPopulatedCollection = {
      ...tempc,
      _id: new mongoose.Types.ObjectId(tempc._id),
      questions: [
        {
          ...tempq,
          _id: new mongoose.Types.ObjectId(tempq._id),
          tags: tempq.tags.map(tag => ({ ...tag, _id: new mongoose.Types.ObjectId(tag._id) })),
          askDateTime: tempq.askDateTime,
          answers: tempq.answers.map(answer => ({
            ...answer,
            _id: new mongoose.Types.ObjectId(answer._id),
            ansDateTime: new Date(answer.ansDateTime),
          })),
        },
      ],
    };

    removeQuestionFromCollectionSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);
    populateCollectionDocumentSpy.mockResolvedValueOnce({ error: 'Error while populating' });

    const response = await supertest(app)
      .post('/collection/removeQuestionFromCollection')
      .send(mockReqBody);

    expect(response.status).toBe(500);
  });
});

describe('POST /renameCollection', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should rename a collection successfully', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      newName: 'New Collection Name',
    };

    const tempc = MOCK_COLLECTIONS[0];

    const mockPopulatedCollection = {
      ...tempc,
      _id: new mongoose.Types.ObjectId(tempc._id),
      name: 'New Collection Name',
      questions: tempc.questions.map(question => ({
        ...question,
        _id: new mongoose.Types.ObjectId(question._id),
        tags: question.tags.map(tag => ({ ...tag, _id: new mongoose.Types.ObjectId(tag._id) })),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: new mongoose.Types.ObjectId(answer._id),
          ansDateTime: new Date(answer.ansDateTime),
        })),
      })),
    };

    renameCollectionSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);
    populateCollectionDocumentSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);

    const response = await supertest(app).post('/collection/renameCollection').send(mockReqBody);

    const expectedResponse = {
      ...mockPopulatedCollection,
      _id: mockPopulatedCollection._id.toString(),
      questions: mockPopulatedCollection.questions.map(question => ({
        ...question,
        _id: question._id.toString(),
        tags: question.tags.map(tag => ({ ...tag, _id: tag._id.toString() })),
        askDateTime: question.askDateTime.toISOString(),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: answer._id.toString(),
          ansDateTime: new Date(answer.ansDateTime).toISOString(),
        })),
      })),
      createdAt: mockPopulatedCollection.createdAt.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the request had cid missing', async () => {
    const mockReqBody = {
      newName: 'New Collection Name',
    };

    const response = await supertest(app).post('/collection/renameCollection').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return bad request error if the request had invalid newName', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      newName: '',
    };

    const response = await supertest(app).post('/collection/renameCollection').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had newName missing', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
    };

    const response = await supertest(app).post('/collection/renameCollection').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should throw error if populateCollectionDocument returns an error', async () => {
    const mockReqBody = {
      cid: MOCK_COLLECTIONS[0]._id,
      newName: 'New Collection Name',
    };

    const tempc = MOCK_COLLECTIONS[0];

    const mockPopulatedCollection = {
      ...tempc,
      _id: new mongoose.Types.ObjectId(tempc._id),
      name: 'New Collection Name',
      questions: tempc.questions.map(question => ({
        ...question,
        _id: new mongoose.Types.ObjectId(question._id),
        tags: question.tags.map(tag => ({ ...tag, _id: new mongoose.Types.ObjectId(tag._id) })),
        answers: question.answers.map(answer => ({
          ...answer,
          _id: new mongoose.Types.ObjectId(answer._id),
          ansDateTime: new Date(answer.ansDateTime),
        })),
      })),
    };

    renameCollectionSpy.mockResolvedValueOnce(mockPopulatedCollection as Collection);
    populateCollectionDocumentSpy.mockResolvedValueOnce({ error: 'Error while populating' });

    const response = await supertest(app).post('/collection/renameCollection').send(mockReqBody);

    expect(response.status).toBe(500);
  });
});

describe('GET /getCollectionById/:cid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return a collection object in the response when the collection id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: '65e9b5a995b6c7045a30d823',
    };

    const findc = MOCK_COLLECTIONS.filter(c => c._id.toString() === mockReqParams.cid)[0];

    const mockPopulatedCollection = {
      ...findc,
      _id: new mongoose.Types.ObjectId(findc._id),
      questions: [],
      createdAt: findc.createdAt,
    };

    // Provide mock question data
    jest
      .spyOn(util, 'fetchCollectionById')
      .mockResolvedValueOnce(mockPopulatedCollection as Collection);

    // Making the request
    const response = await supertest(app).get(`/collection/getCollectionById/${mockReqParams.cid}`);

    const expectedResponse = {
      ...mockPopulatedCollection,
      _id: mockPopulatedCollection._id.toString(),
      createdAt: new Date(mockPopulatedCollection.createdAt).toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the collection id is not in the correct format', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: 'invalid id',
    };

    jest.spyOn(util, 'fetchCollectionById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/collection/getCollectionById/${mockReqParams.cid}`);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid ID format');
  });

  it('should return database error if the collection id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: '65e9b5a995b6c7045a30d823',
    };

    jest.spyOn(util, 'fetchCollectionById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/collection/getCollectionById/${mockReqParams.cid}`);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when fetching the collection', async () => {
    // Mock request parameters
    const mockReqParams = {
      cid: '65e9b5a995b6c7045a30d823',
    };

    jest
      .spyOn(util, 'fetchCollectionById')
      .mockResolvedValueOnce({ error: 'Error while fetching collection by id' });

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.cid}`);

    // Asserting the response
    expect(response.status).toBe(400);
  });
});
