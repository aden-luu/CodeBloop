import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Box, VStack } from '@chakra-ui/react';
import { Room, Chat, User } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import addChat from '../../../services/chatService';
import { addUserToRoom, getRoomById } from '../../../services/roomService';

import ChatHeader from './header';
import ChatView from './chat';
import InputView from './input';

/**
 * ChatPage component that displays the full content of a chat room.
 *
 * @param rid The unique identifier of the chat room to be displayed.
 */
const ChatPage = () => {
  const { rid } = useParams();
  const { user, socket } = useUserContext();
  const [room, setRoom] = useState<Room | null>(null);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isNewMessageSent, setIsNewMessageSent] = useState(false);

  /**
   * Function to assign each user in a room a color to display their username as.
   */
  const userColors = useMemo(() => {
    const colorOptions = [
      'blue.400',
      'green.400',
      'purple.400',
      'orange.400',
      'pink.400',
      'cyan.400',
    ];
    const colors = new Map();
    let colorIndex = 0;
    room?.users.forEach(username => {
      if (username !== user.username) {
        colors.set(username, colorOptions[colorIndex % colorOptions.length]);
        colorIndex++;
      }
    });
    return colors;
  }, [room, user.username]);

  /**
   * Function to scroll to the bottom of the chat messages as you send a new one.
   */
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  /**
   * Function to handle sending a new chat message.
   *
   * @param chat The chat object that is sent.
   * @param targetId The unique identifier of the chat room to send the message to.
   */
  const handleNewChat = async (chat: Chat, targetId: string | undefined) => {
    if (targetId && room) {
      await addChat(targetId, room, chat);
    }
  };

  /**
   * Function to add a new user to a chat room.
   *
   * @param targetId The unique identifier of the chat room to add the user to.
   * @param userToAdd The user object that represents the user to add to the chat room.
   */
  const handleAddUserToChat = async (targetId: string | undefined, userToAdd: User) => {
    if (targetId && userToAdd) {
      await addUserToRoom(targetId, userToAdd);
    }
  };

  /**
   * Function to handle the key down event when a user presses the 'Enter' key.
   * It should help with sending a new chat message.
   *
   * @param event A keyboard event that is triggered when a key is pressed.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const chat: Chat = {
        text: inputValue,
        typedBy: user.username,
        chatDateTime: new Date(),
      };
      handleNewChat(chat, rid);
      setInputValue('');
      setIsNewMessageSent(true);
    }
  };

  /**
   * Function to handle the button click event when a user clicks the 'Send' button.
   * It should help with sending a new chat message (in a similar sense as the key event).
   */
  const handleButtonClick = () => {
    if (inputValue.trim() !== '') {
      const chat: Chat = {
        text: inputValue,
        typedBy: user.username,
        chatDateTime: new Date(),
      };
      handleNewChat(chat, rid);
      setInputValue('');
      setIsNewMessageSent(true);
    }
  };

  /**
   * Function to handle the scroll to bottom effect when a new message is sent.
   */
  useEffect(() => {
    if (room?.chats?.length) {
      setTimeout(() => scrollToBottom(), 0);
    }
  }, [room?.chats]);

  /**
   * Function to handle the scroll to bottom effect when clicking on the chat room.
   */
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (chatEndRef.current) {
      const observer = new MutationObserver(() => {
        scrollToBottom();
      });

      observer.observe(chatEndRef.current, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, []);

  /**
   * Function to refresh to the home page.
   */
  useEffect(() => {
    if (!rid) {
      navigate('/home');
      return;
    }

    /**
     * Function to fetch the chat room by its unique identifier.
     */
    const fetchData = async () => {
      try {
        const res = await getRoomById(rid);
        setRoom(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching chat room:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [rid, navigate]);

  useEffect(() => {
    /**
     * Function to handle a chat update.
     * @param result The chat room object that is updated.
     */
    const handleChatUpdate = ({ result }: { result: Room }) => {
      setRoom(result as Room);
    };

    /**
     * Function to handle updating a room's chat messages in the backend.
     * @param populatedRoom The chat room object that is updated.
     */
    const handleRoomUpdate = (populatedRoom: Room) => {
      setRoom(populatedRoom as Room);
    };

    socket.on('chatUpdate', handleChatUpdate);
    socket.on('roomUpdate', handleRoomUpdate);

    return () => {
      socket.off('chatUpdate', handleChatUpdate);
      socket.off('roomUpdate', handleRoomUpdate);
    };
  }, [socket]);

  if (!room) {
    return null;
  }

  /**
   * Function to handle converting the date a message was sent to either a date or time format.
   *
   * @param date Date object of when the message was sent.
   * @param byHour Boolean value to determine if the date should be formatted by hour.
   */
  const formatDate = (date: Date, byHour: boolean) => {
    if (byHour) {
      return new Date(date).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Function to group chat messages by date.
   */
  const groupedChats = room.chats.reduce<{ [key: string]: Chat[] }>((acc, chat) => {
    const date = new Date(chat.chatDateTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(chat);
    return acc;
  }, {});

  const chatPaddingBottom = isNewMessageSent ? '0' : '6rem';

  return (
    <>
      <Box position='sticky' top='0rem' zIndex='5' bg='brand.300' px='4' py='4' shadow='md'>
        <ChatHeader room={room} />
      </Box>

      <Box flex='1' overflowY='auto' px='4' py='4' bg='brand.50' pb={chatPaddingBottom}>
        {/* Chat Messages */}
        <VStack spacing='0' align='stretch' px='4' py='4' bg='brand.50'>
          {Object.keys(groupedChats).map((dateKey, idx) => (
            <ChatView
              key={idx}
              dateKey={dateKey}
              chats={groupedChats[dateKey]}
              userColors={userColors}
              formatDate={formatDate}
              userUsername={user.username}
            />
          ))}
          <div ref={chatEndRef} style={{ height: 1 }} />
        </VStack>
      </Box>

      {/* Input Box */}
      <Box
        position='sticky'
        bottom='0rem'
        zIndex='5'
        bg='brand.300'
        px='4'
        py='4'
        shadow='sm'
        borderTop='2px solid black'
        boxSizing='border-box'>
        <InputView
          isUserInRoom={room.users.includes(user.username)}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeyDown={handleKeyDown}
          handleButtonClick={handleButtonClick}
          handleAddUserToChat={handleAddUserToChat}
          rid={rid || ''}
          user={user}
        />
      </Box>
    </>
  );
};

export default ChatPage;
