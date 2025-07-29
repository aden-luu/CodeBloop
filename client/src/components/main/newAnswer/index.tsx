import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer } = useAnswerForm();

  return (
    <Form>
      <TextArea
        title='Answer Text'
        id='answerTextInput'
        val={text}
        setState={setText}
        err={textErr}
      />
      <Box display='flex' alignItems='center' mt='4'>
        <Button colorScheme='blue' onClick={postAnswer}>
          Post Answer
        </Button>
        <Text ml='2' fontSize='sm' color='gray.500'>
          * indicates mandatory fields
        </Text>
      </Box>
    </Form>
  );
};

export default NewAnswerPage;
