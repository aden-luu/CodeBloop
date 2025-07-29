import { Box, Text, Flex } from '@chakra-ui/react';
import { Chat } from '../../../../types';
import Username from '../../baseComponents/Username';

/**
 * Interface representing the props for the ChatView component.
 *
 * - dateKey: The date the chats are grouped under.
 * - chats: The chat messages grouped in the date.
 * - userColors: Colors for each chat user.
 * - formatDate: Function to format the date.
 * - userUsername: Username of the current user.
 */
interface ChatProps {
  dateKey: string;
  chats: Chat[];
  userColors: Map<string, string>;
  formatDate: (date: Date, byHour: boolean) => string;
  userUsername: string;
}

/**
 * ChatView component that displays the chat contents of the chatroom with the user's username, profile picture, and timestamp.
 * The username is processed to handle hyperlinks to the user's profile.
 *
 * @param dateKey The date key the chats are grouped under (as a string).
 * @param chats The list of chat objects under the date key.
 * @param userColors The map of user colors for each user.
 * @param formatDate Function to handle formatting the date.
 * @param userUsername The username of the current user (as a string).
 *
 */
const ChatView = ({ dateKey, chats, userColors, formatDate, userUsername }: ChatProps) => (
  <Box>
    <Box display='flex' justifyContent='center' alignItems='center' mb={2} width='100%'>
      <Box backgroundColor='brand.500' flex='1' height='1px' mr={2} />
      <Text color='brand.600' fontSize='sm' fontWeight='bold'>
        {formatDate(new Date(dateKey), false)}
      </Text>
      <Box backgroundColor='brand.600' flex='1' height='1px' ml={2} />
    </Box>
    {chats.map((chat, chatIdx) => {
      const time = formatDate(new Date(chat.chatDateTime), true);
      const isCurrentUser = chat.typedBy === userUsername;
      return (
        <Flex
          key={chatIdx}
          direction='column'
          align={isCurrentUser ? 'flex-end' : 'flex-start'}
          textAlign={isCurrentUser ? 'right' : 'left'}
          mb={4}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Username
              username={chat.typedBy}
              color={isCurrentUser ? 'red' : userColors.get(chat.typedBy) || 'red'}
            />
            <Text as='span' fontSize='xs' color='brand.400' ml={1}>
              @ {time}
            </Text>
          </Box>
          <Text fontSize='md' color='brand.500' mt={1}>
            {chat.text}
          </Text>
        </Flex>
      );
    })}
  </Box>
);

export default ChatView;
