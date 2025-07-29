import { VStack, Text, IconButton } from '@chakra-ui/react';
import { LuArrowDown, LuArrowUp } from 'react-icons/lu';
import { Question } from '../../../types';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import useUserContext from '../../../hooks/useUserContext';
import useVoteStatus from '../../../hooks/useVoteStatus';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent = ({ question }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: string) => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <VStack spacing={-5}>
      <IconButton
        aria-label='Upvote'
        onClick={() => handleVote('upvote')}
        bg='brand.300'
        color={voted === 1 ? 'green.300' : 'brand.50'}
        size='sm'>
        <LuArrowUp />
      </IconButton>
      <Text>{count}</Text>
      <IconButton
        aria-label='Downvote'
        onClick={() => handleVote('downvote')}
        bg='brand.300'
        color={voted === -1 ? 'red' : 'brand.50'}
        size='sm'>
        <LuArrowDown />
      </IconButton>
    </VStack>
  );
};

export default VoteComponent;
