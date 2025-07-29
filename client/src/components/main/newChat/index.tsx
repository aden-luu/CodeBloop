import { Box, Button, Input, Text } from '@chakra-ui/react';
import useNewRoom from '../../../hooks/useNewRoom';

/**
 * NewChatPage component allows users to create a new chat room with a title.
 */
const NewChatPage = () => {
  const { name, setName, nameErr, createRoom } = useNewRoom();

  return (
    <Box display='flex' justifyContent='center' alignItems='center' minH='100vh'>
      <Box
        p={6}
        boxShadow='xl'
        width={{ base: '90%', sm: '80%', md: '800px' }}
        maxWidth='100%'
        display='flex'
        bg='brand.500'
        borderRadius='xl'
        flexDirection='column'
        justifyContent='space-between'>
        <Box mb={6}>
          <Text fontSize='xl' fontWeight='bold' mb={2}>
            Create a New Chat Room
            <Text as='span' color='red.500' ml={1}>
              *
            </Text>
          </Text>
          {/* Title input */}
          <Text fontSize='sm' mb={1}>
            Enter a name for the chat room
          </Text>
          <Input
            id='formNameInput'
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={100}
            placeholder='Chat room name'
            _focus={{ boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)' }}
            _invalid={{ boxShadow: '0 0 0 1px rgba(248, 113, 113, 0.6)' }}
            height='45px'
            mb={2}
            borderRadius='md'
          />
          {nameErr && (
            <Text color='red.500' fontSize='sm' mt={1}>
              {nameErr}
            </Text>
          )}
          {!nameErr && (
            <Text fontSize='sm' color='gray.500'>
              Limit title to 100 characters or less
            </Text>
          )}
        </Box>
        {/* Bottom section */}
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Text fontSize='sm' color='red.500'>
            * indicates mandatory fields
          </Text>
          <Button
            size='lg'
            onClick={createRoom}
            _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
            borderRadius='md'>
            Create Chat Room
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NewChatPage;
