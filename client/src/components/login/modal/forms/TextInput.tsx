import { Input } from '@chakra-ui/react';
import { ChangeEventHandler } from 'react';

/**
 * Interface representing the props for the TextInput component.
 *
 * placeholder - Placeholder text for the input field.
 * type - The type of the input field, defaulting to 'text' if not specified.
 * value - The current value of the input field.
 * onChange - Function to handle changes in the input field.
 */
interface TextInputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

/**
 * TextInput component renders a basic text input field with a customizable
 * placeholder, type, and onChange event handler. Used for capturing user input.
 *
 * @param placeholder - Placeholder text displayed when the input is empty.
 * @param type - Type of the input field (e.g., 'text', 'password').
 * @param value - The current value of the input field.
 * @param onChange - Event handler for handling input changes.
 */
const TextInput = ({ placeholder, type, value, onChange }: TextInputProps) => (
  <Input
    placeholder={placeholder}
    type={type ?? 'text'}
    value={value}
    onChange={onChange}
    bgColor='brand.300'
    required
  />
);

export default TextInput;
