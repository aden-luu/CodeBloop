import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { Question } from '../../../../types';
import { removeQuestionFromCollection } from '../../../../services/collectionService';

/**
 * Interface representing the props for the RemoveQuestionModal component.
 *
 * - cid The ID of the collection from which the question will be removed.
 * - q The question to be removed.
 * - isOpen Boolean indicating if the modal is open.
 * - onClose Callback to handle closing the modal.
 */
interface RemoveQuestionModalProps {
  cid: string;
  q: Question;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * RemoveQuestionModal component that displays a confirmation modal
 * for removing a question from a collection.
 *
 * @param cid The collection ID.
 * @param q The question to be removed.
 * @param isOpen Boolean indicating if the modal is open.
 * @param onClose Callback to close the modal.
 */
const RemoveQuestionModal = ({ cid, q, isOpen, onClose }: RemoveQuestionModalProps) => {
  /**
   * Handles removing a question from the collection.
   */
  const handleRemoveQuestionToCollection = async () => {
    if (!cid) return;

    try {
      await removeQuestionFromCollection(cid, q);
      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error removing question from collection:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='scale'>
      <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='2px' />
      <ModalContent bg='brand.200' color='brand.50'>
        <ModalHeader>Remove Question From Collection</ModalHeader>
        <ModalCloseButton />
        <Text ml={6} mb={4}>
          Are you sure you want to remove this question from the collection?
        </Text>
        <ModalFooter>
          <Button color='brand.50' bg='brand.300' onClick={handleRemoveQuestionToCollection}>
            Remove
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

export default RemoveQuestionModal;
