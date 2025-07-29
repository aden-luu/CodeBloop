import React from 'react';
import { Box, Input, IconButton, Button } from '@chakra-ui/react';
import { AiOutlineSend } from 'react-icons/ai';
import { User } from '../../../../types';

/**
 * Interface for representing the props for the Input component.
 *
 * - isUserInRoom: If the current user has joined the chatroom.
 * - inputValue: The current value of the input field.
 * - setInputValue: Function to set the value of the input field.
 * - handleKeyDown: Function to handle the user pressing 'enter' in the input field.
 * - handleButtonClick: Function to handle the send message button click.
 * - handleAddUserToChat: Function to handle adding the user to the chatroom.
 * - rid: The chatroom id
 * - user: The current user.
 */
interface InputProps {
  isUserInRoom: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  handleAddUserToChat: (rid: string, user: User) => void;
  rid: string;
  user: User;
}

/**
 * Input component that displays the input field for sending messages in the chatroom.
 * Or displays a button to join the chatroom if the user has not joined yet.
 *
 * @param isUserInRoom Boolean for if the current user has joined the chatroom.
 * @param inputValue String representing the current value of the input field.
 * @param setInputValue Function to set the value of the input field.
 * @param handleKeyDown Function to handle the user pressing 'enter' in the input field.
 * @param handleButtonClick Function to handle the send message button click.
 * @param handleAddUserToChat Function to handle adding the user to the chatroom.
 * @param rid The chatroom id as a string.
 * @param user The current user object.
 */
const InputView = ({
  isUserInRoom,
  inputValue,
  setInputValue,
  handleKeyDown,
  handleButtonClick,
  handleAddUserToChat,
  rid,
  user,
}: InputProps) => (
  <Box display='flex' justifyContent={isUserInRoom ? 'space-between' : 'flex-end'}>
    {isUserInRoom ? (
      <>
        <Input
          color='brand.50'
          value={inputValue}
          placeholder='Send Message...'
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconButton
          aria-label='Send message'
          icon={<AiOutlineSend />}
          onClick={handleButtonClick}
          ml={2}
          border='2px solid'
          borderColor='brand.50'
          backgroundColor='brand.50'
          color='brand.300'
          _hover={{
            borderColor: 'brand.300',
            backgroundColor: 'brand.300',
            color: 'brand.50',
          }}
          _active={{
            borderColor: 'brand.50',
            color: 'brand.300',
          }}
          display='flex'
          alignItems='center'
          justifyContent='center'
        />
      </>
    ) : (
      <Button color='brand.300' bg='brand.50' onClick={() => handleAddUserToChat(rid, user)}>
        Join Chat Room
      </Button>
    )}
  </Box>
);

export default InputView;
