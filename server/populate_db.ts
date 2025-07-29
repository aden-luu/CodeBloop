import mongoose from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import { Answer, Comment, Question, Tag, User } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  T1_NAME,
  T1_DESC,
  T2_NAME,
  T2_DESC,
  T3_NAME,
  T3_DESC,
  T4_NAME,
  T4_DESC,
  T5_NAME,
  T5_DESC,
  T6_NAME,
  T6_DESC,
  C1_TEXT,
  C2_TEXT,
  C3_TEXT,
  C4_TEXT,
  C5_TEXT,
  C6_TEXT,
  C7_TEXT,
  C8_TEXT,
  C9_TEXT,
  C10_TEXT,
  C11_TEXT,
  C12_TEXT,
} from './data/posts_strings';
import CommentModel from './models/comments';
import UserModel from './models/users';

// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Creates a new Tag document in the database.
 *
 * @param name The name of the tag.
 * @param description The description of the tag.
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description };
  return await TagModel.create(tag);
}

async function userCreate(username: string, email: string, pfp: string, bio: string): Promise<User> {
  if (username === '' || email === '') throw new Error('Invalid Tag Format');
  const user: User = { username: username, email: email, pfp: pfp, bio: bio };
  return await UserModel.create(user);
}

/**
 * Creates a new Comment document in the database.
 *
 * @param text The content of the comment.
 * @param commentBy The username of the user who commented.
 * @param commentDateTime The date and time when the comment was posted.
 * @returns A Promise that resolves to the created Comment document.
 * @throws An error if any of the parameters are invalid.
 */
async function commentCreate(
  text: string,
  commentBy: string,
  commentDateTime: Date,
  qid: string,
): Promise<Comment> {
  if (text === '' || commentBy === '' || commentDateTime == null)
    throw new Error('Invalid Comment Format');
  const commentDetail: Comment = {
    text: text,
    commentBy: commentBy,
    commentDateTime: commentDateTime,
    qid: qid,
  };
  return await CommentModel.create(commentDetail);
}

/**
 * Creates a new Answer document in the database.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the user who wrote the answer.
 * @param ansDateTime The date and time when the answer was created.
 * @param comments The comments that have been added to the answer.
 * @returns A Promise that resolves to the created Answer document.
 * @throws An error if any of the parameters are invalid.
 */
async function answerCreate(
  text: string,
  ansBy: string,
  ansDateTime: Date,
  comments: Comment[],
  qid: string,
): Promise<Answer> {
  if (text === '' || ansBy === '' || ansDateTime == null || comments == null)
    throw new Error('Invalid Answer Format');
  const answerDetail: Answer = {
    text: text,
    ansBy: ansBy,
    ansDateTime: ansDateTime,
    comments: comments,
    qid: qid,
  };
  return await AnswerModel.create(answerDetail);
}

/**
 * Creates a new Question document in the database.
 *
 * @param title The title of the question.
 * @param text The content of the question.
 * @param tags An array of tags associated with the question.
 * @param answers An array of answers associated with the question.
 * @param askedBy The username of the user who asked the question.
 * @param askDateTime The date and time when the question was asked.
 * @param views An array of usernames who have viewed the question.
 * @param comments An array of comments associated with the question.
 * @returns A Promise that resolves to the created Question document.
 * @throws An error if any of the parameters are invalid.
 */
async function questionCreate(
  title: string,
  text: string,
  tags: Tag[],
  answers: Answer[],
  askedBy: string,
  askDateTime: Date,
  views: string[],
  comments: Comment[],
): Promise<Question> {
  if (
    title === '' ||
    text === '' ||
    tags.length === 0 ||
    askedBy === '' ||
    askDateTime == null ||
    comments == null
  )
    throw new Error('Invalid Question Format');
  const questionDetail: Question = {
    title: title,
    text: text,
    tags: tags,
    askedBy: askedBy,
    answers: answers,
    views: views,
    askDateTime: askDateTime,
    upVotes: [],
    downVotes: [],
    comments: comments,
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    // Step 1: Create tags
    const t1 = await tagCreate(T1_NAME, T1_DESC);
    const t2 = await tagCreate(T2_NAME, T2_DESC);
    const t3 = await tagCreate(T3_NAME, T3_DESC);
    const t4 = await tagCreate(T4_NAME, T4_DESC);
    const t5 = await tagCreate(T5_NAME, T5_DESC);
    const t6 = await tagCreate(T6_NAME, T6_DESC);

    // Step 2: Create users
    const u1 = await userCreate('sana', 'sana@gmail.com', 'pfp1', 'bio1');
    const u2 = await userCreate('ihba001', 'ihba001@gmail.com', 'pfp2', 'bio2');
    const u3 = await userCreate('saltyPeter', 'saltyPeter@gmail.com', 'pfp3', 'bio3');
    const u4 = await userCreate('monkeyABC', 'monkeyABC@gmail.com', 'pfp4', 'bio4');
    const u5 = await userCreate('hamkalo', 'hamkalo@gmail.com', 'pfp1', 'bio5');
    const u6 = await userCreate('azad', 'azad@gmail.com', 'pfp2', 'bio6');
    const u7 = await userCreate('alia', 'alia@gmail.com', 'pfp3', 'bio7');
    const u8 = await userCreate('Joji John', 'joji@gmail.com', 'pfp4', 'bio8');
    const u9 = await userCreate('abaya', 'abaya@gmail.com', 'pfp1', 'bio9');
    const u10 = await userCreate('mackson3332', 'mackson3332@gmail.com', 'pfp2', 'bio10');
    const u11 = await userCreate('elephantCDE', 'elephantCDE@gmail.com', 'pfp3', 'bio11');

    // Step 3: Create questions and store them for later use
    const q1 = await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [],
      'Joji John',
      new Date('2022-01-20T03:00:00'),
      ['sana', 'abaya', 'alia'],
      [],
    );

    const q2 = await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [],
      'saltyPeter',
      new Date('2023-01-10T11:24:30'),
      ['mackson3332'],
      [],
    );

    const q3 = await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [],
      'monkeyABC',
      new Date('2023-02-18T01:02:15'),
      ['monkeyABC', 'elephantCDE'],
      [],
    );

    const q4 = await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [],
      'elephantCDE',
      new Date('2023-03-10T14:28:01'),
      [],
      [],
    );

    // Step 4: Create comments associated with questions
    const c1 = await commentCreate(C1_TEXT, 'sana', new Date('2023-12-12T03:30:00'), q1._id!.toString());
    const c2 = await commentCreate(C2_TEXT, 'ihba001', new Date('2023-12-01T15:24:19'), q1._id!.toString());
    const c3 = await commentCreate(C3_TEXT, 'saltyPeter', new Date('2023-12-18T09:24:00'), q2._id!.toString());
    const c4 = await commentCreate(C4_TEXT, 'monkeyABC', new Date('2023-12-20T03:24:42'), q2._id!.toString());
    const c5 = await commentCreate(C5_TEXT, 'hamkalo', new Date('2023-12-23T08:24:00'), q3._id!.toString());
    const c6 = await commentCreate(C6_TEXT, 'azad', new Date('2023-12-22T17:19:00'), q3._id!.toString());
    const c7 = await commentCreate(C7_TEXT, 'hamkalo', new Date('2023-12-22T21:17:53'), q4._id!.toString());
    const c8 = await commentCreate(C8_TEXT, 'alia', new Date('2023-12-19T18:20:59'), q4._id!.toString());

    // Step 5: Create answers associated with questions
    const a1 = await answerCreate(A1_TXT, 'hamkalo', new Date('2023-11-20T03:24:42'), [c1], q1._id!.toString());
    const a2 = await answerCreate(A2_TXT, 'azad', new Date('2023-11-23T08:24:00'), [c2], q1._id!.toString());
    const a3 = await answerCreate(A3_TXT, 'abaya', new Date('2023-11-18T09:24:00'), [c3], q2._id!.toString());
    const a4 = await answerCreate(A4_TXT, 'alia', new Date('2023-11-12T03:30:00'), [c4], q2._id!.toString());
    const a5 = await answerCreate(A5_TXT, 'sana', new Date('2023-11-01T15:24:19'), [c5], q3._id!.toString());
    const a6 = await answerCreate(A6_TXT, 'abhi3241', new Date('2023-02-19T18:20:59'), [c6], q3._id!.toString());
    const a7 = await answerCreate(A7_TXT, 'mackson3332', new Date('2023-02-22T17:19:00'), [c7], q4._id!.toString());
    const a8 = await answerCreate(A8_TXT, 'ihba001', new Date('2023-03-22T21:17:53'), [c8], q4._id!.toString());

    // Step 6: Update questions to embed answers and comments
    await QuestionModel.findByIdAndUpdate(q1._id, { $push: { answers: a1, comments: c1 } });
    await QuestionModel.findByIdAndUpdate(q1._id, { $push: { answers: a2, comments: c2 } });
    await QuestionModel.findByIdAndUpdate(q2._id, { $push: { answers: a3, comments: c3 } });
    await QuestionModel.findByIdAndUpdate(q2._id, { $push: { answers: a4, comments: c4 } });
    await QuestionModel.findByIdAndUpdate(q3._id, { $push: { answers: a5, comments: c5 } });
    await QuestionModel.findByIdAndUpdate(q3._id, { $push: { answers: a6, comments: c6 } });
    await QuestionModel.findByIdAndUpdate(q4._id, { $push: { answers: a7, comments: c7 } });
    await QuestionModel.findByIdAndUpdate(q4._id, { $push: { answers: a8, comments: c8 } });

    console.log('Database populated successfully');
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    db.close();
    console.log('Database connection closed');
  }
};


populate();

console.log('Processing ...');
