import { Room, User } from '../types';
import api from './config';

const ROOM_API_URL = `${process.env.REACT_APP_SERVER_URL}/room`;

/**
 * Function to get rooms by filter.
 *
 * @param order - The order in which to fetch rooms. Default is 'newest'.
 * @param search - The search term to filter rooms. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering rooms.
 */
const getRoomsByFilter = async (order: string = 'newest', search: string = ''): Promise<Room[]> => {
  const res = await api.get(`${ROOM_API_URL}/getRoom?order=${order}&search=${search}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching or filtering rooms');
  }
  return res.data;
};

/**
 * Function to get a room by its ID.
 *
 * @param rid - The ID of the room to retrieve.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getRoomById = async (rid: string): Promise<Room> => {
  const res = await api.get(`${ROOM_API_URL}/getRoomById/${rid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to add a new chat room.
 *
 * @param r - The room object to add.
 * @throws Error if there is an issue creating the new chat room.
 */
const addRoom = async (r: Room): Promise<Room> => {
  const res = await api.post(`${ROOM_API_URL}/addRoom`, r);

  if (res.status !== 200) {
    throw new Error('Error while creating a new chat room');
  }

  return res.data;
};

/**
 * Function to add a new user to a chat room.
 *
 * @param rid - The room id to add.
 * @param user - The user to be added to the chat room.
 * @throws Error if there is an issue adding the user to the chat room.
 */
const addUserToRoom = async (rid: string, user: User): Promise<Room> => {
  const res = await api.post(`${ROOM_API_URL}/addUserToRoom`, { rid, user });

  if (res.status !== 200) {
    throw new Error('Error while creating a new chat room');
  }

  return res.data;
};

export { getRoomsByFilter, getRoomById, addRoom, addUserToRoom };
