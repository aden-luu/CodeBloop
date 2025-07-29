import React from 'react';
import { HStack, VStack, Text, Button } from '@chakra-ui/react';
import AskQuestionButton from '../../askQuestionButton';
import VoteComponent from '../../voteComponent';
import { Question } from '../../../../types';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - views - The number of views to display in the header.
 * - title - The title of the question or discussion thread.
 * - question - The question to display.
 * - handleNewAnswer - A function to handle adding a new answer.
 */
interface AnswerHeaderProps {
  ansCount: number;
  views: number;
  title: string;
  question: Question;
  handleNewAnswer: () => void;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param views The number of views the question has received.
 * @param title The title of the question or discussion thread.
 * @param question The question object containing voting information.
 * @param handleNewAnswer A function to handle adding a new answer.
 */
const AnswerHeader = ({ ansCount, views, title, question, handleNewAnswer }: AnswerHeaderProps) => (
  <HStack
    justify='space-between'
    p={4}
    w='100%'
    bg='brand.400'
    color='brand.50'
    borderBottom='2px solid white'>
    <HStack spacing='4'>
      <VoteComponent question={question} />
      <VStack align='flex-start'>
        <Text fontWeight='bold' fontSize='2xl'>
          {title}
        </Text>
        <Text fontWeight='bold'>{ansCount} answers</Text>
        <Text fontSize='sm'>{views} views</Text>
      </VStack>
    </HStack>
    <VStack>
      <AskQuestionButton />
      <Button onClick={handleNewAnswer} size='md'>
        Answer Question
      </Button>
    </VStack>
  </HStack>
);

export default AnswerHeader;
