import { Box, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useRoomPage from '../../../hooks/useRoomPage';
import ChatRoomHeader from './header';
import ChatRoomView from './chatroom';

/**
 * ChatRoomPage component that displays the chat rooms available to the user and the number of active rooms.
 * Users can start a new chat room, choose the order of the chat rooms, and join an existing chat room.
 */
const ChatRoomPage = () => {
  const { titleText, rlist, setChatOrder } = useRoomPage();
  const navigate = useNavigate();

  /**
   * Function to navigate to the specified chat room page based on the room ID.
   *
   * @param roomID - The ID of the room to navigate to.
   */
  const handleSelectRoom = (roomID: string) => {
    navigate(`/chats/${roomID}`);
  };

  return (
    <>
      <Box position='sticky' top='0rem' zIndex='5' bg='brand.500' px='4' py='4' shadow='xl'>
        {/* Chat Room Header */}
        <ChatRoomHeader numOfChats={rlist.length} setChatOrder={setChatOrder} />
      </Box>
      <Box p={4} mt={-4}>
        {/* Chat Rooms List */}
        {rlist.length > 0 ? (
          <VStack align='stretch' mt={4} id='room_list'>
            {rlist.map(r => (
              <ChatRoomView key={r._id} room={r} handleSelectRoom={handleSelectRoom} />
            ))}
          </VStack>
        ) : (
          <Box textAlign='center' mt={6}>
            <Text fontSize='xl'>No Active Chats</Text>
          </Box>
        )}
        {/* No chat rooms found message */}
        {titleText === 'Search Results' && !rlist.length && (
          <Box mt={6} textAlign='center'>
            <Text fontSize='xl' fontWeight='bold'>
              No Chat Rooms Found
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChatRoomPage;
