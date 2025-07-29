import api from './config';
import { Chat, Room } from '../types';

const CHAT_API_URL = `${process.env.REACT_APP_SERVER_URL}/chat`;

/**
 * Interface extending the request body when adding a chat to a room, which contains:
 * - id - The unique identifier of the chat room to add the chat to.
 * - room - The room the chat is being added to.
 * - chat - The chat being added.
 */
interface AddChatRequestBody {
  id?: string;
  room: Room;
  chat: Chat;
}

/**
 * Adds a new chat to a specific chat room.
 *
 * @param id - The ID of the room to which the chat is being added.
 * @param room - The room of the chat (to check whether the user is in the chat room).
 * @param chat - The chat object containing the chat details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addChat = async (id: string, room: Room, chat: Chat): Promise<Chat> => {
  const reqBody: AddChatRequestBody = {
    id,
    room,
    chat,
  };
  const res = await api.post(`${CHAT_API_URL}/addChat`, reqBody);
  if (res.status !== 200) {
    throw new Error('Error while creating a new chat for the room');
  }
  return res.data;
};

export default addChat;
