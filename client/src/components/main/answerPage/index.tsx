import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import QuestionBody from './questionBody';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <Box>
      <AnswerHeader
        ansCount={question.answers.length}
        views={question.views.length}
        title={question.title}
        question={question}
        handleNewAnswer={handleNewAnswer}
      />
      <QuestionBody
        text={question.text}
        askby={question.askedBy}
        meta={getMetaData(new Date(question.askDateTime))}
      />
      <CommentSection
        comments={question.comments}
        handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
        qid={questionID}
      />
      <VStack spacing='2' align='stretch' p='4' mt={-2}>
        {question.answers.map((a, idx) => (
          <AnswerView
            key={idx}
            text={a.text}
            ansBy={a.ansBy}
            meta={getMetaData(new Date(a.ansDateTime))}
            comments={a.comments}
            qid={questionID}
            handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default AnswerPage;
