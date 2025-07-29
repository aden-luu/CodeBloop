import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import { Comment } from '../../../../types';
import Username from '../../baseComponents/Username';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  qid: string;
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, qid, handleAddComment }: AnswerProps) => (
  <Box borderWidth='1px' borderRadius='md' p='4' boxShadow='md'>
    <HStack>
      <Username username={ansBy} />
      <Text fontSize='sm' ml='-1'>
        answered {meta}{' '}
      </Text>
    </HStack>
    <Text ml='2' mt='4'>
      {handleHyperlink(text)}
    </Text>
    <Box ml='auto' width='100%'>
      <CommentSection comments={comments} handleAddComment={handleAddComment} qid={qid} />
    </Box>
  </Box>
);

export default AnswerView;
