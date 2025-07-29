import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import QuestionCardView from '../question'; // Adjust the import path as needed
import AnswerCardView from '../answer'; // Adjust the import path as needed
import CommentCardView from '../comment'; // Adjust the import path as needed
import { Question, Answer, Comment } from '../../../../types';

/**
 * Interface representing the props for the CardListView component.
 *
 * - items - List of questions, answers, or comments.
 * - type - The type of the list of items.
 */
interface CardListProps<T> {
  items: T[];
  type: 'question' | 'answer' | 'comment';
}

/**
 * Function to determine the title of the CardListView component based on the type.
 *
 * @param type The type of the list of items.
 */
const getHeadingText = (type: 'question' | 'answer' | 'comment') => {
  switch (type) {
    case 'question':
      return 'Questions';
    case 'answer':
      return 'Answers';
    case 'comment':
      return 'Comments';
    default:
      return '';
  }
};

/**
 * CardListView component that displays a list of questions, answers, or comments.
 * The individual question, answer, and comment cards are processed to handle hyperlinks.
 *
 * @param items The list of the item objects: questions, answers, or comments.
 * @param type The type of the list of items.
 */
const CardListView = <T extends Question | Answer | Comment>({ items, type }: CardListProps<T>) => (
  <Box bg='brand.50' mb={4} borderRadius='lg' boxShadow='lg' overflow='hidden'>
    <Box
      p={6}
      borderBottom='2px solid black'
      boxShadow='inset 0px -3px 6px rgba(0, 0, 0, 0.2)'
      borderTopRadius='lg'>
      <Heading as='h1' size='xl' textAlign='left' fontWeight='bold' color='brand.300'>
        {getHeadingText(type)}
      </Heading>
    </Box>
    <Box p={6}>
      {items.length > 0 ? (
        <VStack align='stretch'>
          {items.map(item => {
            if (type === 'question') {
              return <QuestionCardView key={(item as Question)._id} question={item as Question} />;
            }
            if (type === 'answer') {
              return <AnswerCardView key={(item as Answer).qid} answer={item as Answer} />;
            }
            return <CommentCardView key={(item as Comment).qid} comment={item as Comment} />;
          })}
        </VStack>
      ) : (
        <Text color='brand.300'>{`No ${type}s provided by this user.`}</Text>
      )}
    </Box>
  </Box>
);

export default CardListView;
