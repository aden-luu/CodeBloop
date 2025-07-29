import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
  CloseButton,
} from '@chakra-ui/react';

/**
 * Interface representing the props for the CreateCollectionModal component.
 *
 * - isOpen Indicates if the modal is currently open.
 * - onClose Callback to close the modal.
 * - onCreate Callback to handle the creation of a new collection with the provided name.
 */
interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

/**
 * CreateCollectionModal component that provides a modal interface for creating a new collection.
 *
 * @param isOpen Boolean indicating if the modal is open.
 * @param onClose Callback to close the modal.
 * @param onCreate Callback to create a collection with the given name.
 */
const CreateCollectionModal = ({ isOpen, onClose, onCreate }: CreateCollectionModalProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');

  /**
   * Handles the creation of a collection.
   * Validates the input name and invokes the onCreate callback.
   */
  const handleCreate = () => {
    if (name.trim() === '') {
      setError('*Collection name cannot be empty.');
      return;
    }
    onCreate(name);
    setName('');
    setError('');
    onClose();
  };

  /**
   * Handles closing the modal and resets the error state.
   */
  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='scale'>
      <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='2px' />
      <ModalContent bg='brand.200' color='brand.50'>
        <ModalHeader color='brand.50'>
          Create New Collection
          <CloseButton position='absolute' right={2} top={2} onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <Text color='brand.50' mb={2} fontWeight='semibold'>
            Collection Name*
          </Text>
          <Input
            color='brand.50'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Enter collection name'
          />
          {error && (
            <Text color='red.400' mt={2} fontSize='sm'>
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='brand.50' bg='brand.300' mr={3} onClick={handleCreate}>
            Create
          </Button>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCollectionModal;
