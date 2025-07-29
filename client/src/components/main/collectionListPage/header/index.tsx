import { useState } from 'react';
import { Box, Button, HStack, VStack, Text } from '@chakra-ui/react';
import { CollectionOrderType, collectionOrderTypeDisplayName } from '../../../../types';
import OrderButton from './orderButton';
import CreateCollectionModal from '../createModal';

/**
 * Interface representing the props for the CollectionHeader component.
 *
 * ccnt - The number of collections to be displayed in the header.
 * setCollectionOrder - A function that sets the order of collections based on the selected message.
 * currentOrder - The current order of collections.
 */
interface CollectionHeaderProps {
  ccnt: number;
  setCollectionOrder: (order: CollectionOrderType) => void;
  currentOrder: CollectionOrderType;
  handleAddCollection: (name: string) => void;
}

/**
 * CollectionHeader component displays the header section for a list of collections.
 * It includes the number of the collections, and buttons to set the order of collections.
 *
 * @param ccnt - The number of collections displayed in the header.
 * @param setCollectionOrder - Function to set the order of collections based on input message.
 * @param currentOrder - The current order of collections.
 */
const CollectionHeader = ({
  ccnt,
  setCollectionOrder,
  currentOrder,
  handleAddCollection,
}: CollectionHeaderProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Box w='100%' bg='brand.500'>
      <VStack align='start'>
        <HStack justify='space-between' w='100%' px='4'>
          <Text fontWeight='bold'>Collections</Text>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Collection</Button>
        </HStack>
        <HStack justify='space-between' w='100%' px='4'>
          <Text>{ccnt} Collections</Text>
          <HStack spacing={2}>
            {Object.keys(collectionOrderTypeDisplayName).map((order, idx) => (
              <OrderButton
                key={idx}
                collectionOrderType={order as CollectionOrderType}
                setCollectionOrder={setCollectionOrder}
                currentOrder={currentOrder}
              />
            ))}
          </HStack>
        </HStack>
      </VStack>
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={async name => {
          await handleAddCollection(name);
          setIsCreateModalOpen(false);
        }}
      />
    </Box>
  );
};

export default CollectionHeader;
