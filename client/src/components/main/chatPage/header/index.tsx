import { Text, HStack, VStack } from '@chakra-ui/react';
import { Room } from '../../../../types';
import Username from '../../baseComponents/Username';

/**
 * Interface representing the props for the ChatHeader component.
 *
 * - room - The chat room as an object.
 */
interface ChatHeaderProps {
  room: Room;
}

/**
 * ChatHeader component that displays the header section for the chat room.
 * It includes the number of active users and the date that it was created.
 *
 * @param room The chat room object the header belongs to.
 * @returns The title of the chatroom, the number of active users and the date that it was created.
 */
const ChatHeader = ({ room }: ChatHeaderProps) => {
  const maxUsersToShow = 5;
  const usersToShow = room.users.slice(0, maxUsersToShow);
  const remainingUsersCount = room.users.length - usersToShow.length;

  return (
    <VStack width='100%' align='stretch'>
      <HStack justify='space-between' width='100%'>
        <Text fontWeight='bold' fontSize={{ base: '24px', md: '36px' }} color='brand.50'>
          {room.name}
        </Text>
      </HStack>
      <HStack justify='space-between' width='100%'>
        <HStack width='100%' mt={2}>
          <Text color='brand.50' fontSize='xl' ml={2}>
            {room.users.length} Active User{room.users.length !== 1 ? 's' : ''}:
          </Text>
          <HStack spacing='1' align='center'>
            {usersToShow.map((username, index) => (
              <>
                <Username key={username} username={username} />
                {index < usersToShow.length - 1 && (
                  <Text color='brand.50' fontSize='xl'>
                    ,{' '}
                  </Text>
                )}
              </>
            ))}
            {remainingUsersCount > 0 && (
              <>
                <Text fontSize='xl' color='brand.50'>
                  ,{' '}
                </Text>
                <Text fontSize='md' color='brand.50'>
                  +{remainingUsersCount} more
                </Text>
              </>
            )}
          </HStack>
        </HStack>
        <Text color='brand.50' fontSize='sm' textAlign='right' whiteSpace='nowrap'>
          {`Created on: ${new Date(room.createDateTime).toLocaleDateString()}`}
        </Text>
      </HStack>
    </VStack>
  );
};

export default ChatHeader;
