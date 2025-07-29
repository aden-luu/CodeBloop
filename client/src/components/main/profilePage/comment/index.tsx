import { Box, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Comment } from '../../../../types';

/**
 * Interface representing the props for the CommentCardView component.
 *
 * - comment - The comment to be displayed in the card.
 */
interface CommentCardProps {
  comment: Comment;
}

/**
 * CommentCardView component that displays the content of a comment.
 * The comment text is processed to handle hyperlinks.
 *
 * @param comment The comment object that will be displayed.
 */
const CommentCardView = ({ comment }: CommentCardProps) => (
  <Box
    key={comment.qid}
    p={4}
    borderRadius='md'
    boxShadow='sm'
    border='1px solid'
    borderColor='brand.200'
    _hover={{ cursor: 'pointer' }}>
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <RouterLink to={`/question/${comment.qid}`}>
        <Text color='brand.300' fontWeight='bold' fontSize='lg' textDecoration='underline'>
          {comment.text.slice(0, 50)}
        </Text>
      </RouterLink>
      <Text fontSize='xs'>
        {(() => {
          const commentDate = new Date(comment.commentDateTime);
          const time = commentDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          const date = commentDate.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          });
          return `${time}, ${date}`;
        })()}
      </Text>
    </Box>
  </Box>
);

export default CommentCardView;
