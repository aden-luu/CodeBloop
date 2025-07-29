import { Answer } from '../types';
import api from './config';

const ANSWER_API_URL = `${process.env.REACT_APP_SERVER_URL}/answer`;

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addAnswer = async (qid: string, ans: Answer): Promise<Answer> => {
  const data = { qid, ans };

  const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new answer');
  }
  return res.data;
};

/**
 * Adds a new comment to a specific question.
 *
 * @param id - The ID of the question to which the comment is being added.
 * @param type - The type of the comment, either 'question' or 'answer'.
 * @param comment - The comment object containing the comment details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
export const getAnswerByUsername = async (username: string): Promise<Answer[]> => {
  const res = await api.get(`${ANSWER_API_URL}/getAnswer?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error while creating a new comment for the question');
  }
  return res.data;
};

export default addAnswer;
