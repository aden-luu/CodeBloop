import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Room, Chat } from '../types';
import useUserContext from './useUserContext';
import addChat from '../services/chatService';
import { getRoomById } from '../services/roomService';

/**
 * Custom hook for managing the chat room's state and real-time updates.
 *
 * @returns roomID - The current room ID retrieved from the URL parameters.
 * @returns room - The current room object with its users and chats.
 * @returns handleNewChat - Function to handle the submission of a new chat to a room.
 */
const useChatPage = () => {
  const { rid } = useParams();
  const navigate = useNavigate();

  const { user, socket } = useUserContext();
  const [roomID, setRoomID] = useState<string>(rid || '');
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!rid) {
      navigate('/home');
      return;
    }

    setRoomID(rid);
  }, [rid, navigate]);

  /**
   * Function to handle the submission of a new chat to a room.
   *
   * @param chat - The chat object to be added.
   * @param targetId - The ID of the target being added to.
   */
  const handleNewChat = async (chat: Chat, targetId: string | undefined) => {
    try {
      if (targetId === undefined) {
        throw new Error('No target ID provided.');
      }

      if (room) {
        await addChat(targetId, room, chat);
      } else {
        throw new Error('No chat room to add chat to.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding chat:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch the question data based on the question ID.
     */
    const fetchData = async () => {
      try {
        const res = await getRoomById(roomID);
        setRoom(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching room:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [roomID, user.username]);

  useEffect(() => {
    /**
     * Function to handle chat updates from the socket.
     *
     * @param rid - The room ID.
     * @param chat - The chat object.
     */
    const handleChatUpdate = ({ result }: { result: Room }) => {
      const roomResult = result as Room;

      if (roomResult._id === roomID) {
        setRoom(roomResult);
      }
    };

    socket.on('chatUpdate', handleChatUpdate);

    return () => {
      socket.off('chatUpdate', handleChatUpdate);
    };
  }, [roomID, socket]);

  return {
    roomID,
    room,
    handleNewChat,
  };
};

export default useChatPage;
