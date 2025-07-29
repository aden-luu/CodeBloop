import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';

/**
 * Interface representing the props for the DeleteCollectionModal component.
 *
 * - isOpen Boolean indicating if the modal is open.
 * - onClose Callback to handle closing the modal.
 * - onDelete Callback to handle deleting the collection.
 */
interface DeleteCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

/**
 * DeleteCollectionModal component that provides a modal interface for deleting an existing collection.
 *
 * @param isOpen Boolean indicating if the modal is open.
 * @param onClose Callback to close the modal.
 * @param onDelete Callback to delete the collection.
 */
const DeleteCollectionModal = ({ isOpen, onClose, onDelete }: DeleteCollectionModalProps) => {
  if (!isOpen) return null;

  /**
   * Handles delete.
   */
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='scale'>
      <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='2px' />
      <ModalContent bg='brand.200' color='brand.50'>
        <ModalHeader>Delete Collection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete this collection?</Text>
        </ModalBody>

        <ModalFooter>
          <Button color='brand.50' bg='brand.300' onClick={handleDelete}>
            Delete
          </Button>
          <Button
            color='brand.300'
            bg='brand.50'
            ml={3}
            _hover={{
              bg: 'brand.300',
              color: 'brand.50',
            }}
            onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCollectionModal;
