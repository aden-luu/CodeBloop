import api from './config';
import { User } from '../types';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Adds a new user.
 *
 * @param user - The user being added.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addUser = async (user: User): Promise<User> => {
  const res = await api.post(`${USER_API_URL}/addUser`, user);

  if (res.status !== 200) {
    throw new Error('Error while creating a new user');
  }

  return res.data;
};

/**
 * Function to get users by their username.
 *
 * @param username - The username of the user object.
 * @returns Promise that resolves to a user object or an error if the request fails.
 */
const getUserByUsername = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/getUser?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching user by username');
  }
  return res.data;
};

export { addUser, getUserByUsername };
