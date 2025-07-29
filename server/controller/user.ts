import express, { Response } from 'express';
import { FakeSOSocket, User, AddUserRequest, FindUserByUsername } from '../types';
import { saveUser } from '../models/application';
import UserModel from '../models/users';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a user by its username.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindUserByUsername object containing the username as a parameter.
   * @param res The HTTP response object used to send back the user details.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserByUsername = async (req: FindUserByUsername, res: Response): Promise<void> => {
    const { username } = req.query;

    if (username === undefined) {
      res.status(400).send('Invalid username requesting question.');
      return;
    }

    try {
      const user = await UserModel.findOne({ username });

      if (user && !('error' in user)) {
        res.json(user);
        return;
      }

      throw new Error('Error while fetching user by username');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching user by username: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching user by username`);
      }
    }
  };

  /**
   * Validates the user object to ensure it contains all the necessary fields.
   *
   * @param user The user object to validate.
   *
   * @returns `true` if the user is valid, otherwise `false`.
   */
  const isUserBodyValid = (user: User): boolean =>
    user.username !== undefined &&
    user.username !== '' &&
    user.email !== undefined &&
    user.email !== '' &&
    user.pfp !== undefined &&
    user.pfp !== '' &&
    user.bio !== undefined &&
    user.bio !== '';

  /**
   * Adds a new user to the database. The question is first validated and then saved.
   * If the user is invalid or saving the user fails, the HTTP response status is updated.
   *
   * @param req The AddUserRequest object containing the question data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUser = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req.body)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const user: User = req.body;
    try {
      const result = await saveUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      socket.emit('userUpdate', result as User);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getUser', getUserByUsername);
  router.post('/addUser', addUser);

  return router;
};

export default userController;
