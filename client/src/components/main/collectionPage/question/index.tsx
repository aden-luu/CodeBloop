import { Box, HStack, Text, Tooltip, IconButton } from '@chakra-ui/react';
import { AiOutlineDelete } from 'react-icons/ai';
import RemoveQuestionModal from '../removeModal';
import { Question } from '../../../../types';

/**
 * Interface representing the props for the QuestionView component.
 *
 * - question - The question that will be displayed.
 * - navigate - Function to navigate to the location of the question.
 * - handleClickRemove - Function to handle the the opening of the remove modal.
 * - isRemoveModalOpen - Boolean indicating whether the remove modal is open.
 * - setIsRemoveModalOpen - Function to set the status of the remove modal.
 * - questionToBeRemoved - The question to be removed.
 * - collectionId - The unique identifier of the collection.
 */
interface QuestionViewProps {
  question: Question;
  navigate: (path: string) => void;
  handleClickRemove: (q: Question, event: React.MouseEvent<HTMLButtonElement>) => void;
  isRemoveModalOpen: boolean;
  setIsRemoveModalOpen: (isOpen: boolean) => void;
  questionToBeRemoved: Question | undefined;
  collectionId: string;
}

/**
 * QuestionView component that displays the question card for a question in a collection. This includes:
 * the question title, the number of answers, the number of views, the number of votes, the tags,
 * when the question was asked/posted, and an icon button to remove the question.
 *
 * @param question The question object to be displayed.
 * @param navigate Function to navigate to the location of the question.
 * @param handleClickRemove Function to handle the the opening of the remove modal.
 * @param isRemoveModalOpen Boolean indicating whether the remove modal is open.
 * @param setIsRemoveModalOpen Function to set the status of the remove modal.
 * @param questionToBeRemoved The question object to be removed.
 * @param collectionId The unique identifier string of the collection.
 */
const QuestionView = ({
  question,
  navigate,
  handleClickRemove,
  isRemoveModalOpen,
  setIsRemoveModalOpen,
  questionToBeRemoved,
  collectionId,
}: QuestionViewProps) => (
  <Box
    width='full'
    _hover={{
      transform: 'scale(1.01)',
      shadow: '-1px 5px 2px 1px rgba(83, 102, 68, .2)',
    }}
    transition='all 0.2s ease-in-out'
    cursor='pointer'
    p={4}
    borderWidth={1}
    borderRadius='md'
    borderColor='brand.200'
    my={2}
    onClick={() => navigate(`/question/${question._id}`)}>
    <HStack justify='space-between' align='center' width='full'>
      <Text fontSize='xl' fontWeight='bold'>
        {question.title}
      </Text>
      <Tooltip label='Remove Question' placement='bottom'>
        <IconButton
          aria-label='Remove Question'
          color='red.500'
          icon={<AiOutlineDelete />}
          onClick={event => handleClickRemove(question, event)}
        />
      </Tooltip>
      <RemoveQuestionModal
        cid={collectionId}
        q={questionToBeRemoved!}
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
      />
    </HStack>
    <Box display='flex' justifyContent='space-between' mt={2} flexWrap='wrap'>
      <Box display='flex' justifyContent='flex-start'>
        <Text fontSize='sm' color='brand.50' mr={4}>
          {question.answers.length} answers
        </Text>
        <Text fontSize='sm' color='brand.50' mr={4}>
          {question.views.length} views
        </Text>
        <Text fontSize='sm' color='brand.50'>
          {question.upVotes.length + question.downVotes.length} votes
        </Text>
      </Box>
      <Text fontSize='xs' color='brand.50' whiteSpace='nowrap'>
        Asked on: {new Date(question.askDateTime).toLocaleDateString()}
      </Text>
    </Box>
  </Box>
);

export default QuestionView;
