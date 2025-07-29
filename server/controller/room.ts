import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  FakeSOSocket,
  FindRoomRequest,
  Room,
  FindRoomByIdRequest,
  AddRoomRequest,
  AddUserToRoomRequest,
  User,
} from '../types';
import {
  getRoomsByOrder,
  filterRoomsBySearch,
  fetchRoomById,
  saveRoom,
  populateRoomDocument,
  addUserToRoom,
} from '../models/application';

const roomController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of rooms ordered by a specified criterion.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindRoomRequest object containing the query parameter `order`.
   * @param res The HTTP response object used to send back the filtered list of rooms.
   *
   * @returns A Promise that resolves to void.
   */
  const getRoomsByFilter = async (req: FindRoomRequest, res: Response): Promise<void> => {
    const { order, search } = req.query;
    try {
      const rlist: Room[] = await getRoomsByOrder(order);
      // Filter by search keyword
      const resqlist: Room[] = await filterRoomsBySearch(rlist, search);
      res.json(resqlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching rooms by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching rooms by filter`);
      }
    }
  };

  /**
   * Retrieves a room by its unique ID.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindRoomByIdRequest object containing the room ID as a parameter.
   * @param res The HTTP response object used to send back the room details.
   *
   * @returns A Promise that resolves to void.
   */
  const getRoomById = async (req: FindRoomByIdRequest, res: Response): Promise<void> => {
    const { rid } = req.params;

    if (!ObjectId.isValid(rid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const r = await fetchRoomById(rid);

      if (r && !('error' in r)) {
        res.json(r);
        return;
      }

      throw new Error('Error while fetching room by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching room by id: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching room by id`);
      }
    }
  };

  /**
   * Validates the room object to ensure it contains all the necessary fields.
   *
   * @param room The room object to validate.
   *
   * @returns `true` if the room is valid, otherwise `false`.
   */
  const isRoomBodyValid = (room: Room): boolean =>
    room.name !== undefined &&
    room.name !== '' &&
    room.users !== undefined &&
    room.chats !== undefined &&
    room.createDateTime !== undefined &&
    room.createDateTime !== null;

  /**
   * Adds a new chat room to the database. The chat room is first validated and then saved.
   * If saving the room fails, the HTTP response status is updated.
   *
   * @param req The AddRoomRequest object containing the room data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addRoom = async (req: AddRoomRequest, res: Response): Promise<void> => {
    if (!isRoomBodyValid(req.body)) {
      res.status(400).send('Invalid room body');
      return;
    }
    const room: Room = req.body;
    try {
      const result = await saveRoom(room);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the room that was added, and emits the new object
      const populatedRoom = await populateRoomDocument(result._id?.toString());

      if (populatedRoom && 'error' in populatedRoom) {
        throw new Error(populatedRoom.error);
      }

      socket.emit('roomUpdate', populatedRoom as Room);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving room: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving room`);
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
    user.email !== undefined &&
    user.email !== '' &&
    user.username !== undefined &&
    user.username !== '';

  /**
   * Adds a user to a chat room to the database. The user is first validated and then saved.
   * If the user is invalid or adding the user fails, the HTTP response status is updated.
   *
   * @param req The AddUserToRoomRequest object containing the room and user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUser = async (req: AddUserToRoomRequest, res: Response): Promise<void> => {
    const { rid, user } = req.body;

    if (!isUserBodyValid(user)) {
      res.status(400).send('Invalid user body');
      return;
    }

    try {
      const result = await addUserToRoom(rid, user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the room that was added, and emits the new object
      const populatedRoom = await populateRoomDocument(result._id?.toString());

      if (populatedRoom && 'error' in populatedRoom) {
        throw new Error(populatedRoom.error);
      }

      socket.emit('roomUpdate', populatedRoom as Room);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving room: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving room`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router
  router.get('/getRoom', getRoomsByFilter);
  router.get('/getRoomById/:rid', getRoomById);
  router.post('/addRoom', addRoom);
  router.post('/addUserToRoom', addUser);

  return router;
};

export default roomController;
