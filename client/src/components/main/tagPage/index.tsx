import React from 'react';
import { HStack, VStack, Text } from '@chakra-ui/react';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    <>
      <HStack justify='space-between' px='4' py='2'>
        <Text fontWeight='bold'>{tlist.length} Tags</Text>
        <Text fontWeight='bold'>All Tags</Text>
        <AskQuestionButton />
      </HStack>
      <VStack align='stretch' spacing='4' px='4'>
        {tlist.map((t, idx) => (
          <TagView key={idx} t={t} clickTag={clickTag} />
        ))}
      </VStack>
    </>
  );
};

export default TagPage;
