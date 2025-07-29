import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

/**
 * CreateChatRoomButton component that renders a button for navigating to the
 * "New Chat Room" page. When clicked, it redirects the user to the page
 * where they can create a new chat room.
 */
const CreateChatRoomButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Chat Room" page.
   */
  const handleNewRoom = () => {
    navigate('/new/room');
  };

  return (
    <Button colorScheme='blue' onClick={handleNewRoom}>
      Start Chat
    </Button>
  );
};

export default CreateChatRoomButton;
