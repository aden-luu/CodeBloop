import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  return (
    <Box
      onClick={() => clickTag(t.name)}
      cursor='pointer'
      borderWidth='1px'
      p='4'
      borderRadius='md'>
      <Text fontWeight='bold'>{tag.name}</Text>
      <Text>{tag.description}</Text>
      <Text>{t.qcnt} questions</Text>
    </Box>
  );
};

export default TagView;
