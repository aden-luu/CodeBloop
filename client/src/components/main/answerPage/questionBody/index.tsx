import React from 'react';
import { HStack, VStack, Text } from '@chakra-ui/react';
import { handleHyperlink } from '../../../../tool';
import Username from '../../baseComponents/Username';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  text: string;
  askby: string;
  meta: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ text, askby, meta }: QuestionBodyProps) => (
  <VStack align='start' p={4} spacing='2'>
    <HStack spacing='1' align='center' mb={4}>
      <Username username={askby} />
      <Text fontSize='sm'>asked {meta}</Text>
    </HStack>
    <Text ml='2'>{handleHyperlink(text)}</Text>
  </VStack>
);

export default QuestionBody;
