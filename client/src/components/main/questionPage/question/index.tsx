/* eslint-disable no-console */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, HStack, Button, Text, IconButton } from '@chakra-ui/react';
import { BsBookmark } from 'react-icons/bs';
import { Question } from '../../../../types';
import AddCollectionModal from '../../collectionListPage/addModal';
import Username from '../../baseComponents/Username';
/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Prevents propagation and navigates to the specified tag page.
   */
  const clickTag = (tagName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents event from triggering the main box click
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Navigates to the question page.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  /**
   * Formats a time string into a 12-hour format with AM/PM.
   */
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);

    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });

    return `${time} ${formattedDate}`;
  };

  return (
    <Box
      borderWidth='2px'
      borderColor='brand.200'
      borderRadius='lg'
      p='4'
      cursor='pointer'
      _hover={{
        transform: 'scale(1.01)',
        shadow: '-1px 5px 2px 1px rgba(83, 102, 68, .2)',
      }}
      transition='all 0.2s ease-in-out'
      onClick={() => handleAnswer(q._id!)}>
      <HStack justify='space-between'>
        <Text fontWeight='bold'>{q.title}</Text>
        <IconButton
          aria-label='Add to Collection'
          colorScheme='blue'
          icon={<BsBookmark />}
          onClick={e => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        />
        <AddCollectionModal q={q} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </HStack>
      <HStack spacing='8px' mt='2'>
        <Text>{q.answers.length || 0} answers</Text>
        <Text>{q.views.length} views</Text>
      </HStack>
      <HStack justify='space-between' mt='2'>
        <Box display='flex' gap='8px'>
          {q.tags.map((tag, idx) => (
            <Button
              key={idx}
              size='sm'
              onClick={event => {
                clickTag(tag.name, event);
              }}>
              {tag.name}
            </Button>
          ))}
        </Box>
        <HStack justify='space-between' mt='2'>
          <Username username={q.askedBy} />
          <Text fontSize='sm' color='gray.500'>
            {formatTime(q.askDateTime.toString())}
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default QuestionView;
