import React, { useState } from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import ChatOrderButton from './chatOrderButton';
import CreateChatRoomButton from '../../createChatButton';
import { RoomOrderType } from '../../../../types';

/**
 * Interface representing the props for the ChatRoomHeader component.
 *
 * numOfChats - The number of active chat rooms.
 * setChatOrder - A function that sets the order of chat rooms based on the selected message.
 */
interface ChatRoomHeaderProps {
  numOfChats: number;
  setChatOrder: (order: RoomOrderType) => void;
}

/**
 * ChatRoomHeader component displays the header section for a list of chat rooms.
 * It includes the title, a button to create a new chat room, the number of chat rooms,
 * and buttons to set the order of chat rooms.
 *
 * @param numOfChats - The number of active chat rooms.
 * @param setChatOrder - Function to set the order of chat rooms based on input.
 */
const ChatRoomHeader = ({ numOfChats, setChatOrder }: ChatRoomHeaderProps) => {
  const [isByNewest, setIsByNewest] = useState(true);

  return (
    <Box w='100%' bg='brand.500'>
      <VStack align='start'>
        <HStack justify='space-between' w='100%' px='4'>
          <Text fontWeight='bold'>All Chat Rooms</Text>
          <CreateChatRoomButton />
        </HStack>
        <HStack justify='space-between' w='100%' px='4'>
          <Text>{`${numOfChats} Active Chats`}</Text>
          <HStack spacing={2}>
            <ChatOrderButton
              orderType='newest'
              setChatOrder={setChatOrder}
              isActive={isByNewest}
              setIsByNewest={setIsByNewest}
            />
            <ChatOrderButton
              orderType='mostUsers'
              setChatOrder={setChatOrder}
              isActive={!isByNewest}
              setIsByNewest={setIsByNewest}
            />
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatRoomHeader;
