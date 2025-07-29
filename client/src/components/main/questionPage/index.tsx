import React from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <>
      <Box position='sticky' top='0rem' zIndex='5' bg='brand.500' px='4' py='2' shadow='xl'>
        <QuestionHeader
          titleText={titleText}
          qcnt={qlist.length}
          setQuestionOrder={setQuestionOrder}
        />
      </Box>
      <VStack spacing='6' align='stretch' px='4' pb='10' pt='6'>
        {qlist.map((q, idx) => (
          <QuestionView q={q} key={idx} />
        ))}
      </VStack>
      {titleText === 'Search Results' && !qlist.length && (
        <Text fontWeight='bold' px='4'>
          No Questions Found
        </Text>
      )}
    </>
  );
};

export default QuestionPage;
