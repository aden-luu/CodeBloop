import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

/**
 * Interface representing the props for the Form component.
 *
 * @param children - The React nodes (elements) to be rendered inside the form container.
 */
interface FormProps {
  children: ReactNode;
}

/**
 * Form component that renders a container for form elements.
 * It wraps its children with a styled box component.
 *
 * @param children - The React nodes to be displayed inside the form container.
 */
const Form: React.FC<FormProps> = ({ children }) => (
  <Box
    as='form'
    w='full'
    maxW='lg'
    mx='auto'
    my='10'
    p='6'
    bg='brand.500'
    borderRadius='lg'
    boxShadow='lg'>
    {children}
  </Box>
);

export default Form;
