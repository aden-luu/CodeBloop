/* eslint-disable no-console */
import { useState } from 'react';
import {
  Button,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  CloseButton,
} from '@chakra-ui/react';
import { Collection, Question } from '../../../../types';
import { addCollection, addQuestionToCollection } from '../../../../services/collectionService';
import useUserContext from '../../../../hooks/useUserContext';
import useCollectionListPage from '../../../../hooks/useCollectionListPage';

/**
 * Interface representing the props for the AddCollectionModal component.
 *
 * - q The question to be added to a collection.
 * - isOpen Boolean indicating if the modal is open.
 * - onClose Callback to handle closing the modal.
 */
interface AddCollectionModalProps {
  q: Question;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AddCollectionModal component that provides options to add a question to an existing
 * collection or create a new collection and add the question to it.
 *
 * @param q The question to add to a collection.
 * @param isOpen Indicates if the modal is currently open.
 * @param onClose Callback to close the modal.
 */
const AddCollectionModal = ({ q, isOpen, onClose }: AddCollectionModalProps) => {
  const { user } = useUserContext();
  const { clist } = useCollectionListPage();
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [error, setError] = useState<string>('');

  /**
   * Adds the question to the selected collection.
   */
  const handleAddQuestionToCollection = async () => {
    if (!selectedCollection || selectedCollection === 'Choose a collection') {
      setError('You must choose a valid collection option.');
      return;
    }

    const currentCollection = clist.find(c => c._id === selectedCollection);

    if (currentCollection?.questions.some(questionId => questionId.toString() === q._id)) {
      setError('Question already exists in this collection.');
      return;
    }

    try {
      await addQuestionToCollection(selectedCollection, q);
      setSelectedCollection('');
      setError('');
      onClose();
    } catch (err) {
      console.error('Error adding question to collection:', err);
    }
  };

  /**
   * Creates a new collection and adds the question to it.
   */
  const handleCreateCollectionAndAddQuestion = async () => {
    if (!newCollectionName) {
      setError('Collection name cannot be empty');
      return;
    }

    try {
      await addCollection({
        name: newCollectionName,
        questions: [q],
        user: user.username,
        createdAt: new Date(),
      } as Collection);
      setNewCollectionName('');
      setIsCreating(false);
      onClose();
    } catch (err) {
      console.error('Error creating collection and adding question to it:', err);
    }
  };

  /**
   * Closes the modal and resets the collection choice.
   */
  const handleModalClose = () => {
    setError('');
    setSelectedCollection('');
    onClose();
  };

  /**
   * Changes to new modal to handle creating a new collection.
   */
  const handleCreateNewCollection = () => {
    setError('');
    setSelectedCollection('');
    setIsCreating(true);
  };

  /**
   * Cancels the creation of a new collection.
   */
  const handleCancelCreateNewCollection = () => {
    setError('');
    setSelectedCollection('');
    setIsCreating(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} isCentered motionPreset='scale'>
      <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='2px' />
      <ModalContent bg='brand.200' color='brand.50'>
        <ModalHeader color='brand.50'>
          {isCreating ? 'Create New Collection' : 'Add to Collection'}
          <CloseButton position='absolute' right={2} top={2} onClick={handleModalClose} />
        </ModalHeader>
        <ModalBody>
          {isCreating ? (
            <FormControl mb={4}>
              <FormLabel>Collection Name</FormLabel>
              <Input
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                placeholder='Enter collection name'
              />
              {error && (
                <Text color='#F56565' mt={2}>
                  *{error}
                </Text>
              )}
            </FormControl>
          ) : (
            <FormControl mb={4}>
              <FormLabel color='brand.50'>Select Collection</FormLabel>
              <Select
                value={selectedCollection}
                onChange={e => setSelectedCollection(e.target.value)}
                placeholder='Choose a collection'
                bg='white'
                color='brand.500'
                border='1px solid'
                borderColor='brand.500'>
                {clist.map(c => (
                  <option
                    key={c._id?.toString()}
                    value={c._id?.toString()}
                    style={{
                      color: 'var(--chakra-colors-brand-500)',
                      backgroundColor: 'white',
                    }}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {error && (
                <Text color='#F56565' mt={2}>
                  *{error}
                </Text>
              )}
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          {isCreating ? (
            <>
              <Button
                color='brand.50'
                bg='brand.300'
                onClick={handleCreateCollectionAndAddQuestion}>
                Create
              </Button>
              <Button
                color='brand.300'
                bg='brand.50'
                onClick={handleCancelCreateNewCollection}
                ml={3}
                _hover={{
                  bg: 'brand.300',
                  color: 'brand.50',
                }}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                color='brand.50'
                backgroundColor='brand.300'
                onClick={handleCreateNewCollection}>
                Create New Collection
              </Button>
              <Button
                color='brand.50'
                backgroundColor='brand.300'
                onClick={handleAddQuestionToCollection}
                ml={3}>
                Add
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCollectionModal;
