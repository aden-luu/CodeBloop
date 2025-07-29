import { useState } from 'react';
import { Box, Button, HStack, VStack, Text, Flex, Input } from '@chakra-ui/react';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import Username from '../baseComponents/Username';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 * - qid - the question id
 */
interface CommentSectionProps {
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
  qid: string;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 * @param qid: the question id
 */
const CommentSection = ({ comments, handleAddComment, qid }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
      qid,
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <Box margin='0.5em' padding='0.5em' borderRadius='6px' fontSize='0.9rem'>
      <Box display='flex' justifyContent='flex-start' w='full' mb='4'>
        <Button onClick={() => setShowComments(!showComments)} ml='auto'>
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </Button>
      </Box>
      {showComments && (
        <Box marginTop='0.5em' borderTop='2px dashed white'>
          <Box mb='4'>
            <VStack align='start' mt='4' spacing='2'>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Box key={index} pb='2'>
                    <HStack mb='2'>
                      <Username username={comment.commentBy} />
                      <Text> {getMetaData(new Date(comment.commentDateTime))}</Text>
                    </HStack>
                    <Text ml={2}>{comment.text}</Text>
                  </Box>
                ))
              ) : (
                <Text>No comments yet.</Text>
              )}
            </VStack>
          </Box>

          <Box borderTop='2px solid #ccc' zIndex='10'>
            <Input
              placeholder='Type your comment here...'
              value={text}
              onChange={e => setText(e.target.value)}
              size='sm'
              width='100%'
              mt='2'
            />

            <Flex justifyContent='flex-end'>
              <Button mt='2' onClick={handleAddCommentClick}>
                Add Comment
              </Button>
            </Flex>

            {textErr && <Text color='red.500'>{textErr}</Text>}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
