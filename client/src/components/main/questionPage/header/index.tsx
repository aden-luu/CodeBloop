import { Box, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';
import OrderButton from './orderButton';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => {
  const [activeOrder, setActiveOrder] = useState<OrderType>('newest');
  return (
    <Box>
      <HStack justify='space-between' px='4' py='2'>
        <Text fontWeight='bold'>{titleText}</Text>
        <AskQuestionButton />
      </HStack>
      <HStack justify='space-between' px='4'>
        <Text>{qcnt} questions</Text>
        <HStack align='stretch'>
          {Object.keys(orderTypeDisplayName).map((order, idx) => (
            <OrderButton
              key={idx}
              orderType={order as OrderType}
              setQuestionOrder={setQuestionOrder}
              isActive={activeOrder === order}
              setActiveOrder={setActiveOrder}
            />
          ))}
        </HStack>
      </HStack>
    </Box>
  );
};

export default QuestionHeader;
