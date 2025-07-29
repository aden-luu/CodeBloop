import React, { useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import useCollectionListPage from '../../../hooks/useCollectionListPage';
import CollectionHeader from './header';
import CollectionView from './collection';
import { addCollection, deleteCollection } from '../../../services/collectionService';
import { Collection, CollectionOrderType } from '../../../types';

/**
 * CollectionListPage component that displays the list of collections that a user has.
 * Users can create a new collection, choose the order of the collections,
 * rename an existing collection, or delete an existing collection.
 */
const CollectionListPage = () => {
  const { clist, setCollectionOrder, user } = useCollectionListPage();
  const [currentOrder, setCurrentOrder] = useState<CollectionOrderType>('newest');

  /**
   * Function to change the order of the collection list.
   *
   * @param order The order to sort the collection list by.
   */
  const handleCollectionOrderChange = (order: CollectionOrderType) => {
    setCollectionOrder(order);
    setCurrentOrder(order);
  };

  /**
   * Creates the collection.
   */
  const handleAddCollection = async (name: string) => {
    await addCollection({
      name,
      questions: [],
      user: user.username,
      createdAt: new Date(),
    } as Collection);
  };

  /**
   * Deletes the collection.
   */
  const handleDelete = async (username: string, collectionID: string) => {
    await deleteCollection(collectionID, username);
  };

  return (
    <>
      <Box position='sticky' top='0rem' zIndex='5' bg='brand.500' px='4' py='4' shadow='xl'>
        <CollectionHeader
          ccnt={clist.length}
          setCollectionOrder={handleCollectionOrderChange}
          currentOrder={currentOrder}
          handleAddCollection={handleAddCollection}
        />
      </Box>
      <Box p={4} mt={-4}>
        <VStack align='stretch' mt={4}>
          {clist.map((c, idx) => (
            <CollectionView c={c} key={idx} onDelete={() => handleDelete(user.username, c._id!)} />
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default CollectionListPage;
