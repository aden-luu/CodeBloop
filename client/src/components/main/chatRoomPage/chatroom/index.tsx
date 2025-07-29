import { Box, Text, HStack } from '@chakra-ui/react';
import Username from '../../baseComponents/Username';
import { Room } from '../../../../types';

/**
 * Interface representing the props for the ChatRoomView component.
 *
 * room - The specific chat room to display
 * handleSelectRoom - Function to select a chat room based on the room ID.
 */
interface ChatRoomViewProps {
  room: Room;
  handleSelectRoom: (roomID: string) => void;
}

/**
 * ChatRoomView component displays an individual chat room tile.
 * It includes the name of the chat room, the number of active users, who created it, and when.
 *
 * @param room - The chat room object to display
 * @param handleSelectRoom - Function to select a chat room based on the room ID.
 *
 */
const ChatRoomView = ({ room, handleSelectRoom }: ChatRoomViewProps) => (
  <Box
    borderWidth='2px'
    borderColor='brand.200'
    borderRadius='lg'
    p='4'
    cursor='pointer'
    _hover={{
      transform: 'scale(1.01)',
      shadow: '-1px 5px 2px 1px rgba(83, 102, 68, .2)',
    }}
    transition='all 0.2s ease-in-out'
    onClick={() => {
      if (room._id) {
        handleSelectRoom(room._id);
      }
    }}>
    <Text fontWeight='bold' fontSize='2xl' mt='1'>
      {room.name}
    </Text>
    <HStack justify='space-between' mt='2'>
      <Text color='brand.50'>Active users: {room.users.length || 0}</Text>
      <HStack justify='space-between' mt='2'>
        <Username username={room.users[0] || 'Unknown'} />
        <Text fontSize='sm' color='gray.500'>
          Created On: {new Date(room.createDateTime).toLocaleDateString()}
        </Text>
      </HStack>
    </HStack>
  </Box>
);

export default ChatRoomView;
