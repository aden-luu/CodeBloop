import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Room } from '../types';
import { addRoom, addUserToRoom } from '../services/roomService';

/**
 * Custom hook to handle chat room creation and form validation
 *
 * @returns name - The current value of the name input.
 * @returns nameErr - Error message for the name field, if any.
 * @returns createRoom - Function to validate the form and create a new chat room.
 */
const useNewChat = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [name, setName] = useState<string>('');
  const [nameErr, setNameErr] = useState<string>('');

  /**
   * Function to validate the form before submitting the chat room.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!name) {
      setNameErr('Chat room name cannot be empty');
      isValid = false;
    } else if (name.length > 100) {
      setNameErr('Chat room name cannot be more than 100 characters');
      isValid = false;
    } else {
      setNameErr('');
    }

    return isValid;
  };

  /**
   * Function to create a chat room to the server.
   *
   * @returns name - The current value of the name input.
   */
  const createRoom = async () => {
    if (!validateForm()) return;

    const room: Room = {
      name,
      users: [],
      chats: [],
      createDateTime: new Date(),
    };

    const resRoom = await addRoom(room);

    if (resRoom && resRoom._id) {
      const addUserRes = await addUserToRoom(resRoom._id, user);
      if (addUserRes && addUserRes._id) {
        navigate('/chats');
      }
    }
  };

  return {
    name,
    setName,
    nameErr,
    createRoom,
  };
};

export default useNewChat;
