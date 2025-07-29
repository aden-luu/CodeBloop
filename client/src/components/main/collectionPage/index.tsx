import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import useCollectionPage from '../../../hooks/useCollectionPage';
import { Question } from '../../../types';
import QuestionView from './question';

/**
 * CollectionPage component that displays a collection and its associated questions.
 * Users can navigate to questions or remove them from the collection.
 */
const CollectionPage = () => {
  const navigate = useNavigate();
  const { collection } = useCollectionPage();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [questionToBeRemoved, setQuestionToBeRemoved] = useState<Question | undefined>();

  if (!collection) {
    return null;
  }

  /**
   * Handles opening the remove question modal.
   *
   * @param q The question to be removed.
   * @param event The click event triggering the action.
   */
  const handleClickRemove = (q: Question, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsRemoveModalOpen(true);
    setQuestionToBeRemoved(q);
  };

  return (
    <VStack align='start' spacing={4}>
      {/* Header section */}
      <Box width='full' bg='brand.500' p={4}>
        <Text fontSize='2xl' fontWeight='bold'>
          {collection.name}
        </Text>
        <Box display='flex' justifyContent='space-between' mt={2}>
          <Text fontSize='lg' color='brand.50'>
            {collection.questions.length} questions
          </Text>
          <HStack display='flex' justifyContent='flex-end'>
            <Text fontSize='sm' color='brand.50'>
              Created by: {collection.user}
            </Text>
            <Text fontSize='sm' color='brand.50'>
              Created on: {new Date(collection.createdAt).toLocaleDateString()}
            </Text>
          </HStack>
        </Box>
      </Box>

      {/* Questions list */}
      <VStack spacing={4} width='full' p={4} mt={-2}>
        {collection.questions.map((q, idx) => (
          <QuestionView
            key={idx}
            question={q}
            navigate={navigate}
            handleClickRemove={handleClickRemove}
            isRemoveModalOpen={isRemoveModalOpen}
            setIsRemoveModalOpen={setIsRemoveModalOpen}
            questionToBeRemoved={questionToBeRemoved}
            collectionId={collection._id!}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default CollectionPage;
