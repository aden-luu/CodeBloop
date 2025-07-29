import { useNavigate } from 'react-router-dom';
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
import { Box, Text, Tooltip, HStack, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { Collection } from '../../../../types';
import RenameCollectionModal from '../renameModal';
import DeleteCollectionModal from '../deleteModal';
import Username from '../../baseComponents/Username';

/**
 * Interface representing the props for the Collection component.
 *
 * c - The collection object containing details about the collection.
 * onDelete - Callback to handle the deletion of the collection.
 */
interface CollectionProps {
  c: Collection;
  onDelete: () => void;
}

/**
 * CollectionView component that displays the collection which includes the number of questions
 * in the collection, who created it and when, and the ability to rename or delete the collection.
 *
 * @param c The collection object containing details about the collection.
 * @param onDelete Callback to handle the deletion of the collection.
 */
const CollectionView = ({ c, onDelete }: CollectionProps) => {
  const navigate = useNavigate();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /**
   * Navigates to the collection page.
   */
  const handleClick = (collectionID: string) => {
    navigate(`/collections/${collectionID}`);
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
      onClick={() => handleClick(c._id!)}>
      <HStack justify='space-between'>
        <Text fontWeight='bold' fontSize='lg'>
          {c.name}
        </Text>
        <HStack spacing={2}>
          <Tooltip label='Rename your collection.' placement='bottom'>
            <IconButton
              aria-label='Rename Collection'
              color='gray.400'
              icon={<AiFillEdit />}
              onClick={e => {
                e.stopPropagation(); // Prevent the title click event from being triggered
                setIsRenameModalOpen(true);
              }}
            />
            <RenameCollectionModal
              c={c}
              isOpen={isRenameModalOpen}
              onClose={() => setIsRenameModalOpen(false)}
            />
          </Tooltip>
          <Tooltip label='Delete your collection.' placement='bottom'>
            <IconButton
              aria-label='Delete Collection'
              color='red'
              icon={<AiOutlineDelete />}
              onClick={e => {
                e.stopPropagation(); // Prevent title click navigation
                setIsDeleteModalOpen(true);
              }}
            />
            <DeleteCollectionModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={onDelete}
            />
          </Tooltip>
        </HStack>
      </HStack>
      <HStack justify='space-between' mt='2'>
        <Text color='brand.50'>Total Questions: {c.questions.length || 0}</Text>
        <HStack justify='space-between' mt='2'>
          <Username username={c.user} />
          <Text fontSize='sm' color='gray.500'>
            Created On: {new Date(c.createdAt).toLocaleDateString()}
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default CollectionView;
