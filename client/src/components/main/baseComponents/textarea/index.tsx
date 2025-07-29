import React from 'react';
import {
  FormControl,
  FormLabel,
  Textarea as ChakraTextarea,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';

/**
 * Interface representing the props for the Textarea component.
 *
 * @param title - The label to display above the textarea.
 * @param mandatory - Indicates whether the field is required. Default is true.
 * @param hint - An optional helper text providing additional information.
 * @param id - The unique identifier for the input field.
 * @param val - The current value of the input field.
 * @param setState - Callback function to update the state with the input field's value.
 * @param err - An optional error message displayed if there's an issue with the input.
 */
interface TextAreaProps {
  title: string;
  mandatory?: boolean;
  hint?: string;
  id: string;
  val: string;
  setState: (value: string) => void;
  err?: string;
}

/**
 * Textarea component renders a customizable input with optional title, hint,
 * error message, and mandatory indication.
 *
 * @param title - The label of the textarea.
 * @param mandatory - Indicates whether the textarea is mandatory. Default is true.
 * @param hint - Optional text providing additional instructions.
 * @param id - The unique identifier of the textarea element.
 * @param val - The current value of the textarea.
 * @param setState - The function to update the state of the textarea value.
 * @param err - Optional error message displayed when there's an issue with input.
 */
const TextArea = ({ title, mandatory = true, hint, id, val, setState, err }: TextAreaProps) => (
  <FormControl isRequired={mandatory} isInvalid={!!err} mb='4'>
    <FormLabel htmlFor={id}>
      {title}
      {mandatory && '*'}
    </FormLabel>
    {hint && <FormHelperText mb='2'>{hint}</FormHelperText>}
    <ChakraTextarea
      id={id}
      value={val}
      onChange={e => setState(e.target.value)}
      variant='outline'
      focusBorderColor='brand.50'
      bg='brand.300'
      color='brand.50'
      _placeholder={{ color: 'brand.100' }}
      borderColor='brand.200'
    />
    {err && <FormErrorMessage>{err}</FormErrorMessage>}
  </FormControl>
);

export default TextArea;
