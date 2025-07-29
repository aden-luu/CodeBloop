import { Box, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Answer } from '../../../../types';

/**
 * Interface representing the props for the AnswerCardView component.
 *
 * - answer - The answer to be displayed in the card.
 */
interface AnswerCardProps {
  answer: Answer;
}

/**
 * AnswerCardView component that displays the content of an answer including how many comments
 * and when the answer was generated. The answer text is processed to handle hyperlinks.
 *
 * @param answer The answer object that will be displayed.
 */
const AnswerCardView = ({ answer }: AnswerCardProps) => (
  <Box
    key={answer.qid}
    p={4}
    borderRadius='md'
    boxShadow='sm'
    border='1px solid'
    borderColor='brand.200'
    _hover={{ cursor: 'pointer' }}>
    <Box display='flex' alignItems='center' mb={2}>
      <RouterLink to={`/question/${answer.qid}`}>
        <Text color='brand.300' fontWeight='bold' fontSize='lg' textDecoration='underline'>
          {answer.text.slice(0, 50)}
        </Text>
      </RouterLink>
    </Box>
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <Text color='brand.200' fontSize='sm'>
        {answer.comments.length} comments
      </Text>
      <Text color='brand.200' fontSize='xs'>
        Answered On: {new Date(answer.ansDateTime).toLocaleString()}
      </Text>
    </Box>
  </Box>
);

export default AnswerCardView;
