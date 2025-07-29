import { Box, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Question } from '../../../../types';

/**
 * Interface representing the props for the QuestionCardView component.
 *
 * - question - The question to be displayed in the card.
 */
interface QuestionCardProps {
  question: Question;
}

/**
 * QuestionCardView component that displays the content of a question that includes:
 * how many answers, views, and votes the question has, the tags of the question, and when it was asked.
 * The question text is processed to handle hyperlinks.
 *
 * @param question The question object that will be displayed.
 */
const QuestionCardView = ({ question }: QuestionCardProps) => (
  <Box
    key={question._id}
    p={4}
    borderRadius='md'
    boxShadow='sm'
    border='1px solid'
    borderColor='brand.200'
    _hover={{ cursor: 'pointer' }}>
    <Box display='flex' alignItems='center' mb={2}>
      <RouterLink to={`/question/${question._id}`}>
        <Text color='brand.300' fontWeight='bold' fontSize='lg' textDecoration='underline'>
          {question.title}
        </Text>
      </RouterLink>
    </Box>
    <Box display='flex' gap={3} fontSize='sm' mb={2}>
      <Text color='brand.200'>{question.answers.length} answers</Text>
      <Text color='brand.200'>{question.views.length} views</Text>
      <Text color='brand.200'>{question.upVotes.length + question.downVotes.length} votes</Text>
    </Box>
    <Box display='flex' justifyContent='space-between'>
      <Box display='flex' flexWrap='wrap' gap={2}>
        {question.tags.map(tag => (
          <Box
            key={tag._id}
            px={2}
            py={1}
            bg='brand.300'
            color='brand.50'
            fontSize='sm'
            borderRadius='md'
            boxShadow='sm'>
            {tag.name}
          </Box>
        ))}
      </Box>
      <Text color='brand.200' fontSize='xs' alignSelf='center'>
        Asked On: {new Date(question.askDateTime).toLocaleString()}
      </Text>
    </Box>
  </Box>
);

export default QuestionCardView;
