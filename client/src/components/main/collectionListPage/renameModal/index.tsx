import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { renameCollection } from '../../../../services/collectionService';
import { Collection } from '../../../../types';

/**
 * Interface representing the props for the RenameCollectionModal component.
 *
 * - c The collection to be renamed.
 * - isOpen Boolean indicating if the modal is open.
 * - onClose Callback to handle closing the modal.
 */
interface RenameCollectionModalProps {
  c: Collection;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * RenameCollectionModal component that provides a modal interface
 * for renaming an existing collection.
 *
 * @param c The collection to be renamed.
 * @param isOpen Boolean indicating if the modal is open.
 * @param onClose Callback to close the modal.
 */
const RenameCollectionModal = ({ c, isOpen, onClose }: RenameCollectionModalProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');

  /**
   * Handles the renaming of the collection.
   * Validates the new name and invokes the renameCollection function.
   */
  const handleRename = async () => {
    if (name.trim() === '') {
      setError('*Collection name cannot be empty.');
      return;
    }

    await renameCollection(c._id!, name);
    setName('');
    setError('');
    onClose();
  };

  /**
   * Handles closing the modal and resets the input fields and error state.
   */
  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered motionPreset='scale'>
      <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='2px' />
      <ModalContent bg='brand.200' color='brand.50'>
        <ModalHeader>Rename Collection</ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody>
          <Text>New Name*</Text>
          <Input
            placeholder='Enter a new name...'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {error && (
            <Text color='red.400' mt={2} fontSize='sm'>
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='brand.50' bg='brand.300' onClick={handleRename}>
            Rename
          </Button>
          <Button
            color='brand.300'
            bg='brand.50'
            ml={3}
            _hover={{
              bg: 'brand.300',
              color: 'brand.50',
            }}
            onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenameCollectionModal;
