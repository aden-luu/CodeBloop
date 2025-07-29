import { ObjectId } from 'mongodb';
import * as util from '../models/application';
import Tags from '../models/tags';
import QuestionModel from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  processTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  saveComment,
  addComment,
  addVoteToQuestion,
  filterRoomsBySearch,
  getRoomsByOrder,
  fetchRoomById,
  saveRoom,
  saveChat,
  addChat,
  addUserToRoom,
  getCollectionsByOrder,
  fetchCollectionById,
  fetchCollectionByUser,
  saveCollection,
  addQuestionToCollection,
  removeQuestionFromCollection,
  renameCollection,
  deleteCollection,
} from '../models/application';
import { Answer, Question, Tag, Comment, Chat, Room, Collection } from '../types';
import { T1_DESC, T2_DESC, T3_DESC } from '../data/posts_strings';
import AnswerModel from '../models/answers';
import CommentModel from '../models/comments';
import ChatModel from '../models/chats';
import RoomModel from '../models/rooms';
import CollectionModel from '../models/collections';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
  description: T1_DESC,
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
  description: T2_DESC,
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
  description: T3_DESC,
};

const com1: Comment = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'com1',
  commentBy: 'com_by1',
  commentDateTime: new Date('2023-11-18T09:25:00'),
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ansBy: 'ansBy1',
  ansDateTime: new Date('2023-11-18T09:24:00'),
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ansBy: 'ansBy2',
  ansDateTime: new Date('2023-11-20T09:24:00'),
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ansBy: 'ansBy3',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ansBy: 'ansBy4',
  ansDateTime: new Date('2023-11-19T09:24:00'),
  comments: [],
  qid: '65e9b58910afe6e94fc6e6dc',
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    askedBy: 'q_by1',
    askDateTime: new Date('2023-11-16T09:24:00'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    askedBy: 'q_by2',
    askDateTime: new Date('2023-11-17T09:24:00'),
    views: ['question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by3',
    askDateTime: new Date('2023-11-19T09:24:00'),
    views: ['question1_user', 'question2_user', 'question3_user', 'question4_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    askedBy: 'q_by4',
    askDateTime: new Date('2023-11-20T09:24:00'),
    views: [],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const chat1: Chat = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'chat1',
  typedBy: 'chat_by1',
  chatDateTime: new Date('2023-11-18T09:25:00'),
};

const chat2: Chat = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'chat2',
  typedBy: 'chat_by2',
  chatDateTime: new Date('2023-11-20T09:30:00'),
};

const chat3: Chat = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'chat3',
  typedBy: 'chat_by3',
  chatDateTime: new Date('2023-11-25T09:40:00'),
};

const ROOMS: Room[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    name: 'React Fan Club',
    users: ['chat_by1', 'chat_by2', 'chat_by3'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2023-11-16T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    name: 'Python Fan Club',
    users: ['chat_by1', 'chat_by2', 'chat_by3', 'someone_else'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2023-11-17T09:25:00'),
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    name: 'I heart C++',
    users: ['chat_by1'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2023-11-20T09:42:00'),
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    name: 'Full Stackers',
    users: ['chat_by1', 'chat_by2'],
    chats: [chat1, chat2, chat3],
    createDateTime: new Date('2023-11-25T09:50:00'),
  },
];

const COLLECTIONS: Collection[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    name: 'Want to Learn',
    user: 'collection_by1',
    questions: [QUESTIONS[0], QUESTIONS[1]],
    createdAt: new Date('2023-11-16T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    name: 'Miscellaneous',
    user: 'collection_by2',
    questions: [QUESTIONS[1], QUESTIONS[3]],
    createdAt: new Date('2023-11-16T09:25:00'),
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    name: 'All',
    user: 'collection_by1',
    questions: QUESTIONS,
    createdAt: new Date('2023-11-16T09:24:00'),
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    name: 'Unknown',
    user: 'collection_by1',
    questions: [QUESTIONS[3]],
    createdAt: new Date('2023-11-16T09:24:00'),
  },
];

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });
  describe('Question model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterQuestionsBySearch', () => {
      test('filter questions with empty search string should return all questions', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '');

        expect(result.length).toEqual(QUESTIONS.length);
      });

      test('filter questions with empty list of questions should return empty list', () => {
        const result = filterQuestionsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter questions with empty questions and empty string should return empty list', () => {
        const result = filterQuestionsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter question by one tag', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android]');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });

      test('filter question by multiple tags', () => {
        const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one user', () => {
        const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('filter question by tag and then by user', () => {
        let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
        result = filterQuestionsByAskedBy(result, 'q_by2');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by one keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });

      test('filter question by tag and keyword', () => {
        const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
      });
    });

    describe('getQuestionsByOrder', () => {
      test('get active questions, newest questions sorted by most recently answered 1', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS.slice(0, 3), 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get active questions, newest questions sorted by most recently answered 2', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            answers: [ans1, ans3], // 18, 19 => 19
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de02',
            answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de03',
            answers: [ans1], // 18 => 18
            askDateTime: new Date('2023-11-19T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            answers: [ans4], // 19 => 19
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            answers: [],
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');
        QuestionModel.schema.path('answers', Object);
        QuestionModel.schema.path('tags', Object);

        const result = await getQuestionsByOrder('active');

        expect(result.length).toEqual(5);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
        expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest unanswered questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('unanswered');

        expect(result.length).toEqual(2);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('get newest questions', async () => {
        const questions = [
          {
            _id: '65e9b716ff0e892116b2de01',
            askDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            askDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            askDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(QuestionModel).toReturn(questions, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most viewed questions', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');

        const result = await getQuestionsByOrder('mostViewed');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getQuestionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getQuestionsByOrder should return empty list if find returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');

        const result = await getQuestionsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchAndIncrementQuestionViewsById', () => {
      test('fetchAndIncrementQuestionViewsById should return question and add the user to the list of views if new', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(
          { ...question, views: ['question1_user', ...question.views] },
          'findOneAndUpdate',
        );
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question1_user',
        )) as Question;

        expect(result.views.length).toEqual(2);
        expect(result.views).toEqual(['question1_user', 'question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return question and not add the user to the list of views if already viewed by them', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');
        QuestionModel.schema.path('answers', Object);

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b5a995b6c7045a30d823',
          'question2_user',
        )) as Question;

        expect(result.views.length).toEqual(1);
        expect(result.views).toEqual(['question2_user']);
        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.title).toEqual(question.title);
        expect(result.text).toEqual(question.text);
        expect(result.answers).toEqual(question.answers);
        expect(result.askDateTime).toEqual(question.askDateTime);
      });

      test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question1_user',
        );

        expect(result).toBeNull();
      });

      test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = (await fetchAndIncrementQuestionViewsById(
          '65e9b716ff0e892116b2de01',
          'question2_user',
        )) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching and updating a question');
      });
    });

    describe('saveQuestion', () => {
      test('saveQuestion should return the saved question', async () => {
        const mockQn = {
          title: 'New Question Title',
          text: 'New Question Text',
          tags: [tag1, tag2],
          askedBy: 'question3_user',
          askDateTime: new Date('2024-06-06'),
          answers: [],
          views: [],
          upVotes: [],
          downVotes: [],
          comments: [],
        };

        const result = (await saveQuestion(mockQn)) as Question;

        expect(result._id).toBeDefined();
        expect(result.title).toEqual(mockQn.title);
        expect(result.text).toEqual(mockQn.text);
        expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
        expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
        expect(result.askedBy).toEqual(mockQn.askedBy);
        expect(result.askDateTime).toEqual(mockQn.askDateTime);
        expect(result.views).toEqual([]);
        expect(result.answers.length).toEqual(0);
      });
    });

    describe('addVoteToQuestion', () => {
      test('addVoteToQuestion should upvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('If a downvoter upvotes, add them to upvotes and remove them from downvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: ['testUser'], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Question upvoted successfully',
          upVotes: ['testUser'],
          downVotes: [],
        });
      });

      test('should cancel the upvote if already upvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({
          msg: 'Upvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'upvote');

        expect(result).toEqual({ error: 'Error when adding upvote to question' });
      });

      test('addVoteToQuestion should downvote a question', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('If an upvoter downvotes, add them to downvotes and remove them from upvotes', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: ['testUser'],
          downVotes: [],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: ['testUser'] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Question downvoted successfully',
          upVotes: [],
          downVotes: ['testUser'],
        });
      });

      test('should cancel the downvote if already downvoted', async () => {
        const mockQuestion = {
          _id: 'someQuestionId',
          upVotes: [],
          downVotes: ['testUser'],
        };

        mockingoose(QuestionModel).toReturn(
          { ...mockQuestion, upVotes: [], downVotes: [] },
          'findOneAndUpdate',
        );

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({
          msg: 'Downvote cancelled successfully',
          upVotes: [],
          downVotes: [],
        });
      });

      test('addVoteToQuestion should return an error if the question is not found', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findById');

        const result = await addVoteToQuestion('nonExistentId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Question not found!' });
      });

      test('addVoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
        mockingoose(QuestionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addVoteToQuestion('someQuestionId', 'testUser', 'downvote');

        expect(result).toEqual({ error: 'Error when adding downvote to question' });
      });
    });
  });

  describe('Answer model', () => {
    describe('saveAnswer', () => {
      test('saveAnswer should return the saved answer', async () => {
        const mockAnswer = {
          text: 'This is a test answer',
          ansBy: 'dummyUserId',
          ansDateTime: new Date('2024-06-06'),
          comments: [],
          qid: '65e9b58910afe6e94fc6e6dc',
        };

        const result = (await saveAnswer(mockAnswer)) as Answer;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(mockAnswer.text);
        expect(result.ansBy).toEqual(mockAnswer.ansBy);
        expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
      });

      test('saveAnswer should return an error if there is an error in saving the answer', async () => {
        jest.spyOn(AnswerModel, 'create').mockImplementation(() => {
          throw new Error('Error when saving answer to the database');
        });

        const result = await saveAnswer(ans3);

        expect(result).toEqual({ error: 'Error when saving an answer' });
      });
    });

    describe('addAnswerToQuestion', () => {
      test('addAnswerToQuestion should return the updated question', async () => {
        const question = QUESTIONS.filter(
          q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];
        (question.answers as Answer[]).push(ans4);
        jest.spyOn(QuestionModel, 'findOneAndUpdate').mockResolvedValueOnce(question);

        const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

        expect(result.answers.length).toEqual(4);
        expect(result.answers).toContain(ans4);
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
        mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

        const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
        const invalidAnswer: Partial<Answer> = {
          text: 'This is an answer text',
          ansBy: 'user123', // Missing ansDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addAnswerToQuestion(qid, invalidAnswer as Answer);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid answer');
        }
      });
    });
  });

  describe('Tag model', () => {
    describe('addTag', () => {
      test('addTag return tag if the tag already exists', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result?._id).toEqual(tag1._id);
      });

      test('addTag return tag id of new tag if does not exist in database', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeDefined();
      });

      test('addTag returns null if findOne throws an error', async () => {
        mockingoose(Tags).toReturn(new Error('error'), 'findOne');

        const result = await addTag({ name: tag1.name, description: tag1.description });

        expect(result).toBeNull();
      });

      test('addTag returns null if save throws an error', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(new Error('error'), 'save');

        const result = await addTag({ name: tag2.name, description: tag2.description });

        expect(result).toBeNull();
      });
    });

    describe('processTags', () => {
      test('processTags should return the tags of tag names in the collection', async () => {
        mockingoose(Tags).toReturn(tag1, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
        expect(result[0]._id).toEqual(tag1._id);
        expect(result[1]._id).toEqual(tag1._id);
      });

      test('processTags should return a list of new tags ids if they do not exist in the collection', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(2);
      });

      test('processTags should return empty list if an error is thrown when finding tags', async () => {
        mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });

      test('processTags should return empty list if an error is thrown when saving tags', async () => {
        mockingoose(Tags).toReturn(null, 'findOne');
        mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

        const result = await processTags([tag1, tag2]);

        expect(result.length).toEqual(0);
      });
    });

    describe('getTagCountMap', () => {
      test('getTagCountMap should return a map of tag names and their counts', async () => {
        mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        QuestionModel.schema.path('tags', Object);

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.size).toEqual(3);
        expect(result.get('react')).toEqual(1);
        expect(result.get('javascript')).toEqual(2);
        expect(result.get('android')).toEqual(1);
      });

      test('getTagCountMap should return an object with error if an error is thrown', async () => {
        mockingoose(QuestionModel).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(new Error('error'), 'find');

        const result = await getTagCountMap();

        if (result && 'error' in result) {
          expect(true).toBeTruthy();
        } else {
          expect(false).toBeTruthy();
        }
      });

      test('getTagCountMap should return null if Tags find returns null', async () => {
        mockingoose(QuestionModel).toReturn(QUESTIONS, 'find');
        mockingoose(Tags).toReturn(null, 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });

      test('getTagCountMap should return default map if QuestionModel find returns null but not tag find', async () => {
        mockingoose(QuestionModel).toReturn(null, 'find');
        mockingoose(Tags).toReturn([tag1], 'find');

        const result = (await getTagCountMap()) as Map<string, number>;

        expect(result.get('react')).toBe(0);
      });

      test('getTagCountMap should return null if find returns []', async () => {
        mockingoose(QuestionModel).toReturn([], 'find');
        mockingoose(Tags).toReturn([], 'find');

        const result = await getTagCountMap();

        expect(result).toBeNull();
      });
    });
  });

  describe('Comment model', () => {
    describe('saveComment', () => {
      test('saveComment should return the saved comment', async () => {
        const result = (await saveComment(com1)) as Comment;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(com1.text);
        expect(result.commentBy).toEqual(com1.commentBy);
        expect(result.commentDateTime).toEqual(com1.commentDateTime);
      });

      test('saveComment should return an error if there is an error in saving the comment to the database', async () => {
        jest.spyOn(CommentModel, 'create').mockImplementation(() => {
          throw new Error('Error when saving comment to the database');
        });

        const result = (await saveComment(com1)) as Comment;

        expect(result).toEqual({ error: 'Error when saving a comment' });
      });
    });

    describe('addComment', () => {
      test('addComment should return the updated question when given `question`', async () => {
        // copy the question to avoid modifying the original
        const question = { ...QUESTIONS[0], comments: [com1] };
        mockingoose(QuestionModel).toReturn(question, 'findOneAndUpdate');

        const result = (await addComment(
          question._id?.toString() as string,
          'question',
          com1,
        )) as Question;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return the updated answer when given `answer`', async () => {
        // copy the answer to avoid modifying the original
        const answer: Answer = { ...ans1 };
        (answer.comments as Comment[]).push(com1);
        mockingoose(AnswerModel).toReturn(answer, 'findOneAndUpdate');

        const result = (await addComment(
          answer._id?.toString() as string,
          'answer',
          com1,
        )) as Answer;

        expect(result.comments.length).toEqual(1);
        expect(result.comments).toContain(com1._id);
      });

      test('addComment should return an object with error if findOneAndUpdate throws an error', async () => {
        const question = QUESTIONS[0];
        mockingoose(QuestionModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addComment(question._id?.toString() as string, 'question', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Error from findOneAndUpdate' });
      });

      test('addComment should return an object with error if findOneAndUpdate returns null', async () => {
        const answer: Answer = { ...ans1 };
        mockingoose(AnswerModel).toReturn(null, 'findOneAndUpdate');
        const result = await addComment(answer._id?.toString() as string, 'answer', com1);
        expect(result).toEqual({ error: 'Error when adding comment: Failed to add comment' });
      });

      test('addComment should throw an error if a required field is missing in the comment', async () => {
        const invalidComment: Partial<Comment> = {
          text: 'This is an answer text',
          commentBy: 'user123', // Missing commentDateTime
        };

        const qid = 'validQuestionId';

        try {
          await addComment(qid, 'question', invalidComment as Comment);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid comment');
        }
      });
    });
  });

  describe('Room model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('filterRoomsBySearch', () => {
      test('filter rooms with empty search string should return all rooms', () => {
        const result = filterRoomsBySearch(ROOMS, '');

        expect(result.length).toEqual(ROOMS.length);
      });

      test('filter rooms with empty list of rooms should return empty list', () => {
        const result = filterRoomsBySearch([], 'react');

        expect(result.length).toEqual(0);
      });

      test('filter rooms with empty rooms and empty string should return empty list', () => {
        const result = filterRoomsBySearch([], '');

        expect(result.length).toEqual(0);
      });

      test('filter room by one keyword', () => {
        const result = filterRoomsBySearch(ROOMS, 'react');

        expect(result.length).toEqual(1);
        expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
      });
    });

    describe('getRoomsByOrder', () => {
      test('get newest rooms', async () => {
        const rooms = [
          {
            _id: '65e9b716ff0e892116b2de01',
            createDateTime: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            createDateTime: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            createDateTime: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(RoomModel).toReturn(rooms, 'find');

        const result = await getRoomsByOrder('newest');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest most popular rooms', async () => {
        mockingoose(RoomModel).toReturn(ROOMS, 'find');

        const result = await getRoomsByOrder('mostUsers');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
        expect(result[3]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
      });

      test('getRoomsByOrder should return empty list if find throws an error', async () => {
        mockingoose(RoomModel).toReturn(new Error('error'), 'find');

        const result = await getRoomsByOrder('newest');

        expect(result.length).toEqual(0);
      });

      test('getRoomsByOrder should return empty list if find returns null', async () => {
        mockingoose(RoomModel).toReturn(null, 'find');

        const result = await getRoomsByOrder('newest');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchRoomById', () => {
      test('fetchRoomById should return room', async () => {
        const room = ROOMS.filter(r => r._id && r._id.toString() === '65e9b5a995b6c7045a30d823')[0];
        mockingoose(RoomModel).toReturn(room, 'findOne');

        const result = (await fetchRoomById('65e9b5a995b6c7045a30d823')) as Room;

        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.name).toEqual(room.name);
        expect(result.users).toEqual(room.users);
        expect(result.chats).toEqual(room.chats.map(chat => chat._id));
        expect(result.createDateTime).toEqual(room.createDateTime);
      });

      test('fetchRoomById should return null if id does not exist', async () => {
        mockingoose(RoomModel).toReturn(null, 'findOne');

        const result = await fetchRoomById('65e9b716ff0e892116b2de01');

        expect(result).toBeNull();
      });

      test('fetchRoomById should return an object with error if findOne throws an error', async () => {
        mockingoose(RoomModel).toReturn(new Error('error'), 'findOne');

        const result = (await fetchRoomById('65e9b716ff0e892116b2de01')) as {
          error: string;
        };

        expect(result.error).toEqual('Error when fetching a room');
      });
    });

    describe('saveRoom', () => {
      test('saveRoom should return the saved room', async () => {
        const mockRoom = {
          name: 'New Chat Room Title',
          chats: [chat1, chat2],
          users: ['chat_by1', 'chat_by2'],
          createDateTime: new Date('2024-06-06'),
        };

        const result = (await saveRoom(mockRoom)) as Room;

        expect(result._id).toBeDefined();
        expect(result.name).toEqual(mockRoom.name);
        expect(result.chats[0]._id?.toString()).toEqual(chat1._id?.toString());
        expect(result.chats[1]._id?.toString()).toEqual(chat2._id?.toString());
        expect(result.createDateTime).toEqual(mockRoom.createDateTime);
        expect(result.users).toEqual(['chat_by1', 'chat_by2']);
      });

      test('saveRoom should return an error if there is an error in saving the room', async () => {
        jest.spyOn(RoomModel, 'create').mockImplementation(() => {
          throw new Error('Error when trying to save a room to the database');
        });

        const mockRoom = {
          name: 'Hi There',
          chats: [chat1],
          users: ['chat_by1'],
          createDateTime: new Date('2024-06-23'),
        };

        const result = (await saveRoom(mockRoom)) as Room;

        expect(result).toEqual({ error: 'Error when saving a room' });
      });
    });

    describe('addUserToRoom', () => {
      const testUser = {
        username: 'testUser',
        email: 'testUser@gmail.com',
        pfp: 'pfp1',
        bio: 'bio1',
      };

      test('addUserToRoom should add a user to room', async () => {
        const mockRoom = {
          _id: 'someRoomId',
          users: [],
          chats: [],
        };

        mockingoose(RoomModel).toReturn({ ...mockRoom, users: ['testUser'] }, 'findOneAndUpdate');

        const result = await addUserToRoom('someRoomId', testUser);

        expect((result as Room).users).toEqual(['testUser']);
      });

      test('addUserToRoom should return an error if the room is not found', async () => {
        mockingoose(RoomModel).toReturn(null, 'findOneAndUpdate');

        const result = await addUserToRoom('nonExistentId', testUser);

        expect(result).toEqual({
          error: 'Error when adding user to chat room: Failed to add user to the chat room',
        });
      });

      test('addUserToRoom should return an error when there is an issue with adding a user to a room', async () => {
        mockingoose(RoomModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await addUserToRoom('someRoomId', testUser);

        expect(result).toEqual({ error: 'Error when adding user to chat room: Database error' });
      });
    });
  });

  describe('Chat model', () => {
    describe('saveChat', () => {
      test('saveChat should return the saved chat', async () => {
        const result = (await saveChat(chat1)) as Chat;

        expect(result._id).toBeDefined();
        expect(result.text).toEqual(chat1.text);
        expect(result.typedBy).toEqual(chat1.typedBy);
        expect(result.chatDateTime).toEqual(chat1.chatDateTime);
      });

      test('saveChat should return an error if there is an error in saving the chat', async () => {
        jest.spyOn(ChatModel, 'create').mockImplementation(() => {
          throw new Error('Database error');
        });

        const result = (await saveChat(chat1)) as Chat;

        expect(result).toEqual({ error: 'Error when saving a chat' });
      });
    });

    describe('addChat', () => {
      test('addChat should return the updated room', async () => {
        const room = { ...ROOMS[0], chats: [chat1] };
        mockingoose(RoomModel).toReturn(room, 'findOneAndUpdate');

        const result = (await addChat(room._id?.toString() as string, room, chat1)) as Room;

        expect(result.chats.length).toEqual(1);
        expect(result.chats).toContain(chat1._id);
      });

      test('addChat should return an object with error if findOneAndUpdate throws an error', async () => {
        const room = ROOMS[0];
        mockingoose(RoomModel).toReturn(
          new Error('Error from findOneAndUpdate'),
          'findOneAndUpdate',
        );
        const result = await addChat(room._id?.toString() as string, room, chat1);
        expect(result).toEqual({
          error: 'Error when adding chat to chat room: Error from findOneAndUpdate',
        });
      });

      test('addChat should return an object with error if findOneAndUpdate returns null', async () => {
        const room = ROOMS[0];
        mockingoose(RoomModel).toReturn(null, 'findOneAndUpdate');
        const result = await addChat(room._id?.toString() as string, room, chat1);
        expect(result).toEqual({
          error: 'Error when adding chat to chat room: Failed to add chat to the chat room',
        });
      });

      test('addChat should throw an error if a required field is missing in the chat', async () => {
        const room = ROOMS[0];
        const invalidChat: Partial<Chat> = {
          text: 'This is a chat',
          typedBy: 'user123', // Missing chatDateTime
        };

        try {
          await addChat(room._id?.toString() as string, room, invalidChat as Chat);
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(Error);
          if (err instanceof Error) expect(err.message).toBe('Invalid chat');
        }
      });
    });
  });

  describe('Collection model', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    describe('getCollectionsByOrder', () => {
      test('get newest collections', async () => {
        const collections = [
          {
            _id: '65e9b716ff0e892116b2de01',
            user: 'testUser',
            createdAt: new Date('2023-11-20T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de04',
            user: 'testUser',
            createdAt: new Date('2023-11-21T09:24:00'),
          },
          {
            _id: '65e9b716ff0e892116b2de05',
            user: 'testUser',
            createdAt: new Date('2023-11-19T10:24:00'),
          },
        ];
        mockingoose(CollectionModel).toReturn(collections, 'find');

        const result = await getCollectionsByOrder('newest', 'testUser');

        expect(result.length).toEqual(3);
        expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
        expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
        expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
      });

      test('get newest collections with the most questions', async () => {
        mockingoose(CollectionModel).toReturn(COLLECTIONS, 'find');

        const result = await getCollectionsByOrder('mostQuestions', 'collection_by1');

        expect(result.length).toEqual(4);
        expect(result[0]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
        expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result[2]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
        expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
      });

      test('getCollectionsByOrder should return empty list if find throws an error', async () => {
        mockingoose(CollectionModel).toReturn(new Error('error'), 'find');

        const result = await getCollectionsByOrder('newest', 'testUser');

        expect(result.length).toEqual(0);
      });

      test('getCollectionsByOrder should return empty list if find returns null', async () => {
        mockingoose(CollectionModel).toReturn(null, 'find');

        const result = await getCollectionsByOrder('newest', 'testUser');

        expect(result.length).toEqual(0);
      });
    });

    describe('fetchCollectionById', () => {
      test('fetchCollectionById should return collection', async () => {
        const collection = COLLECTIONS.filter(
          c => c._id && c._id.toString() === '65e9b5a995b6c7045a30d823',
        )[0];

        mockingoose(CollectionModel).toReturn(collection, 'findOne');
        CollectionModel.schema.path('questions', Object);

        const result = (await fetchCollectionById('65e9b5a995b6c7045a30d823')) as Collection;

        expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
        expect(result.name).toEqual(collection.name);
        expect(result.user).toEqual(collection.user);
        expect(result.questions).toEqual(collection.questions);
        expect(result.createdAt).toEqual(collection.createdAt);
      });

      test('fetchCollectionById should throw if id does not exist', async () => {
        mockingoose(CollectionModel).toReturn(null, 'findById');

        const result = await fetchCollectionById('65e9b716ff0e892116b2de01');

        expect(result).toEqual({ error: 'Collection not found' });
      });

      test('fetchCollectionById should return an object with error if findById throws an error', async () => {
        mockingoose(CollectionModel).toReturn(new Error('error'), 'findById');

        const result = (await fetchCollectionById('65e9b716ff0e892116b2de01')) as {
          error: string;
        };

        expect(result.error).toEqual('Collection not found');
      });
    });

    describe('fetchCollectionByUser', () => {
      test('fetchCollectionByUser should return collections created by the specified user', async () => {
        const collections = COLLECTIONS.filter(c => c.user && c.user === 'collection_by1');
        mockingoose(CollectionModel).toReturn(collections, 'find');
        CollectionModel.schema.path('questions', Object);

        const result = (await fetchCollectionByUser('collection_by1')) as Collection[];

        expect(result.length).toEqual(3);
        expect(result[0].name).toEqual('Want to Learn');
        expect(result[1].name).toEqual('All');
        expect(result[2].name).toEqual('Unknown');
      });

      test('fetchCollectionByUser should throw if user does not exist', async () => {
        mockingoose(CollectionModel).toReturn(null, 'find');

        const result = await fetchCollectionByUser('idontexist');

        expect(result).toEqual({ error: 'Collection by this user not found' });
      });

      test('fetchCollectionByUser should return an object with error if find throws an error', async () => {
        mockingoose(CollectionModel).toReturn(new Error('error with find'), 'find');

        const result = (await fetchCollectionByUser('testUser')) as {
          error: string;
        };

        expect(result.error).toEqual('Error fetching collections: error with find');
      });
    });

    describe('saveCollection', () => {
      test('saveCollection should return the saved collection', async () => {
        const mockCn = {
          name: 'New Collection Name',
          user: 'collection1_user',
          questions: [],
          createdAt: new Date('2024-06-06'),
        };

        const result = (await saveCollection(mockCn)) as Collection;

        expect(result._id).toBeDefined();
        expect(result.name).toEqual(mockCn.name);
        expect(result.user).toEqual(mockCn.user);
        expect(result.createdAt).toEqual(mockCn.createdAt);
        expect(result.questions.length).toEqual(0);
      });
    });

    describe('addQuestionToCollection', () => {
      test('addQuestionToCollection should add a question to collection', async () => {
        const cid = new ObjectId('65e9b716ff0e892116b2de01');
        const mockCollection = {
          _id: cid,
          name: 'Some Collection',
          user: 'collectionUser',
          questions: [],
          createdAt: new Date('01-01-2024'),
        };

        mockingoose(CollectionModel).toReturn(
          { ...mockCollection, questions: [QUESTIONS[0]] },
          'findOneAndUpdate',
        );

        jest.spyOn(util, 'fetchCollectionById').mockResolvedValueOnce(mockCollection);

        const result = await addQuestionToCollection(cid.toString(), QUESTIONS[0]);

        expect((result as Collection).questions).toEqual([QUESTIONS[0]]);
      });

      test('should not add a question that already exists in the collection', async () => {
        const cid = new ObjectId('65e9b716ff0e892116b2de01');
        const mockCollection = {
          _id: cid,
          name: 'Some Collection',
          user: 'collectionUser',
          questions: [QUESTIONS[0]],
          createdAt: new Date('01-01-2024'),
        };

        mockingoose(CollectionModel).toReturn(
          { ...mockCollection, questions: [QUESTIONS[0]] },
          'findOneAndUpdate',
        );

        jest.spyOn(util, 'fetchCollectionById').mockResolvedValueOnce(mockCollection);

        const result = await addQuestionToCollection(cid.toString(), QUESTIONS[0]);

        expect(result).toEqual({
          error: 'Question already exists in the collection.',
        });
      });

      test('addQuestionToCollection should return an error if the collection is not found', async () => {
        const cid = new ObjectId('65e9b716ff0e892116b2de01');
        const mockCollection = {
          _id: cid,
          name: 'Some Collection',
          user: 'collectionUser',
          questions: [],
          createdAt: new Date('01-01-2024'),
        };
        mockingoose(CollectionModel).toReturn(null, 'findOneAndUpdate');

        jest.spyOn(util, 'fetchCollectionById').mockResolvedValueOnce(mockCollection);
        const result = await addQuestionToCollection('nonExistentId', QUESTIONS[0]);

        expect(result).toEqual({ error: 'Error when adding question to collection' });
      });

      test('addQuestionToCollection should return an error when there is an issue with adding a question to collection', async () => {
        const cid = new ObjectId('65e9b716ff0e892116b2de01');
        const mockCollection = {
          _id: cid,
          name: 'Some Collection',
          user: 'collectionUser',
          questions: [],
          createdAt: new Date('01-01-2024'),
        };
        mockingoose(CollectionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        jest.spyOn(util, 'fetchCollectionById').mockResolvedValueOnce(mockCollection);
        const result = await addQuestionToCollection('someQuestionId', QUESTIONS[0]);

        expect(result).toEqual({ error: 'Database error' });
      });
    });

    describe('removeQuestionFromCollection', () => {
      test('removeQuestionFromCollection should remove a question from collection', async () => {
        const mockCollection = {
          _id: 'someCollectionId',
          questions: [QUESTIONS[0]],
        };

        mockingoose(CollectionModel).toReturn(
          { ...mockCollection, questions: [] },
          'findOneAndUpdate',
        );

        const result = await removeQuestionFromCollection(mockCollection._id, QUESTIONS[0]);

        expect((result as Collection).questions).toEqual([]);
      });

      test('removeQuestionFromCollection should return an error if the collection is not found', async () => {
        mockingoose(CollectionModel).toReturn(null, 'findOneAndUpdate');

        const result = await removeQuestionFromCollection('nonExistentId', QUESTIONS[0]);

        expect(result).toEqual({ error: 'Error when removing question from collection' });
      });

      test('removeQuestionFromCollection should return an error when there is an issue with removing a question from collection', async () => {
        mockingoose(CollectionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await removeQuestionFromCollection('someQuestionId', QUESTIONS[0]);

        expect(result).toEqual({ error: 'Error when removing question from collection' });
      });
    });

    describe('renameCollection', () => {
      test('renameCollection should rename collection', async () => {
        const mockCollection = {
          _id: 'someCollectionId',
          name: 'someCollectionName',
        };

        mockingoose(CollectionModel).toReturn(
          { ...mockCollection, name: 'New Collection Name' },
          'findOneAndUpdate',
        );

        const result = await renameCollection(mockCollection._id, 'New Collection Name');

        expect((result as Collection).name).toEqual('New Collection Name');
      });

      test('renameCollection should return an error if the collection is not found', async () => {
        mockingoose(CollectionModel).toReturn(null, 'findOneAndUpdate');

        const result = await renameCollection('nonExistentId', 'New Collection Name');

        expect(result).toEqual({ error: 'Error when renaming collection' });
      });

      test('renameCollection should return an error when there is an issue with renaming a collection', async () => {
        mockingoose(CollectionModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const result = await renameCollection('someCollectionId', 'New Collection Name');

        expect(result).toEqual({ error: 'Error when renaming collection' });
      });
    });

    describe('deleteCollection', () => {
      test('deleteCollection should remove collection from database', async () => {
        const mockUser = 'testUser';
        const mockCid = 'mockCollectionId';
        const mockReturnCid = new ObjectId('65e9b58910afe6e94fc6e6dc');
        const mockDeleteResult = { _id: mockCid, name: 'Test Collection' };
        const mockUpdatedResult = [
          {
            _id: mockReturnCid,
            name: 'Another Collection',
            user: mockUser,
            createdAt: new Date('2024-06-06'),
            questions: [],
          },
        ];

        mockingoose(CollectionModel).toReturn(mockDeleteResult, 'findByIdAndDelete');
        jest.spyOn(util, 'fetchCollectionByUser').mockResolvedValueOnce(mockUpdatedResult);

        const result = await deleteCollection(mockCid, mockUser);

        expect(result).toEqual(mockUpdatedResult);
      });

      test('deleteCollection should return an error if the collection is not found', async () => {
        mockingoose(CollectionModel).toReturn(null, 'findByIdAndDelete');

        const result = await deleteCollection('nonExistentId', 'testUser');

        expect(result).toEqual({ error: 'Collection by this user not found' });
      });

      test('deleteCollection should return an error when there is an issue with deleting a collection', async () => {
        mockingoose(CollectionModel).toReturn(new Error('Database error'), 'findByIdAndDelete');

        const result = await deleteCollection('someCollectionId', 'testUser');

        expect(result).toEqual({ error: 'Collection by this user not found' });
      });
    });
  });
});
