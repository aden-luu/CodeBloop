import React from 'react';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';

/**
 * Interface representing the props for the Input component.
 *
 * @param title - The label to display above the input field.
 * @param hint - An optional hint or description displayed below the label.
 * @param id - The unique identifier for the input field.
 * @param mandatory - Indicates whether the input field is required. Defaults to true.
 * @param val - The current value of the input field.
 * @param setState - Callback function to update the state with the input field's value.
 * @param err - An optional error message to display if there is an issue with the input field.
 */
interface InputProps {
  title: string;
  hint?: string;
  id: string;
  mandatory?: boolean;
  val: string;
  setState: (value: string) => void;
  err?: string;
}

/**
 * Input component that renders a labeled text input field with optional hint and error message.
 * It also displays an asterisk (*) if the field is mandatory.
 *
 * @param title - The label for the input field.
 * @param hint - Optional hint or description for the input field.
 * @param id - The unique identifier for the input field.
 * @param mandatory - Indicates if the input field is required. Defaults to true.
 * @param val - The current value of the input field.
 * @param setState - Callback function to update the value of the input field.
 * @param err - Optional error message to display below the input field.
 */
const Input = ({ title, hint, id, mandatory = true, val, setState, err }: InputProps) => (
  <FormControl isRequired={mandatory} isInvalid={!!err} mb='4'>
    <FormLabel htmlFor={id}>
      {title}
      {mandatory && '*'}
    </FormLabel>
    {hint && <FormHelperText mb='2'>{hint}</FormHelperText>}
    <ChakraInput
      id={id}
      value={val}
      onChange={e => setState(e.target.value)}
      variant='outline'
      focusBorderColor='brand.50'
      bg='brand.300'
      color='brand.50'
    />
    {err && <FormErrorMessage>{err}</FormErrorMessage>}
  </FormControl>
);

export default Input;
