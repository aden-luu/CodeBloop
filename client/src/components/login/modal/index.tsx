import { Flex, Box, Button, Text } from '@chakra-ui/react';
import { FormEvent, ReactNode } from 'react';

/**
 * Interface representing the props for the CustomModal component.
 *
 * @property {boolean} isOpen - Determines whether the modal is open.
 * @property {() => void} onClose - Function to close the modal.
 * @property {boolean} isSignup - Indicates if the modal is for signing up (true) or logging in (false).
 * @property {(e: FormEvent<HTMLFormElement>) => void} onSubmit - Function to handle form submission.
 * @property {ReactNode} children - The form fields to be displayed inside the modal.
 */
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignup: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

/**
 * CustomModal component displays a modal for user login or signup.
 * It is conditionally rendered based on the `isOpen` prop.
 *
 * @param {CustomModalProps} props - The props required by the CustomModal component.
 * @returns {JSX.Element | null} - A modal with a form for login or signup, or null if not open.
 */
const CustomModal = ({ isOpen, onClose, isSignup, onSubmit, children }: CustomModalProps) => {
  if (!isOpen) return null;

  return (
    <Flex
      position='fixed'
      top='0'
      left='0'
      right='0'
      bottom='0'
      bg='rgba(0, 0, 0, 0.5)'
      align='center'
      justify='center'
      zIndex='1000'>
      <Box bg='brand.50' p={6} borderRadius='md' boxShadow='lg' maxW='400px' w='100%'>
        <Button position='absolute' top='2' right='2' onClick={onClose}>
          &times;
        </Button>
        <Text fontSize='lg' fontWeight='bold' mb={4} variant='highlight'>
          {isSignup ? 'Sign Up' : 'Login'}
        </Text>
        <form onSubmit={onSubmit}>
          {children}
          <Button mt={4} type='submit' width='100%'>
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default CustomModal;
