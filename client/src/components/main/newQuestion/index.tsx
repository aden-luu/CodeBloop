import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';

/**
 * NewQuestionPage component that provides a form for users to submit a new question.
 * Users can enter a title, description, and tags. Errors are displayed for invalid inputs.
 *
 * @returns A form with fields for question submission.
 */
const NewQuestionPage = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion();

  return (
    <Form>
      <Input
        title='Question Title'
        hint='Limit title to 100 characters or less'
        id='formTitleInput'
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title='Question Text'
        hint='Add details'
        id='formTextInput'
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title='Tags'
        hint='Add keywords separated by whitespace'
        id='formTagInput'
        val={tagNames}
        setState={setTagNames}
        err={tagErr}
      />
      <Box display='flex' alignItems='center' mt='4'>
        <Button colorScheme='blue' onClick={postQuestion}>
          Post Question
        </Button>
        <Text ml='2' fontSize='sm'>
          * indicates mandatory fields
        </Text>
      </Box>
    </Form>
  );
};

export default NewQuestionPage;
