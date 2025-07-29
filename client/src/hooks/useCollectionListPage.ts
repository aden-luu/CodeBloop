import { useState, useEffect } from 'react';
import { Collection, CollectionOrderType } from '../types';
import { getCollectionsByFilter } from '../services/collectionService';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage collections.
 *
 * @returns An object containing collections and functions to manage them.
 */
const useCollectionListPage = () => {
  const { user, socket } = useUserContext();
  const [collectionOrder, setCollectionOrder] = useState<CollectionOrderType>('newest');
  const [clist, setClist] = useState<Collection[]>([]);

  useEffect(() => {
    /**
     * Function to fetch collections based on the filter and update the collection list.
     */
    const fetchData = async () => {
      try {
        const res = await getCollectionsByFilter(collectionOrder, user.username);
        setClist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to handle collection updates from the socket.
     *
     * @param collection - the updated collection object.
     */
    const handleCollectionUpdate = (collection: Collection) => {
      setClist(prevClist => {
        const collectionExists = prevClist.some(c => c._id === collection._id);

        if (collectionExists) {
          // Update the existing collection
          return prevClist.map(c => (c._id === collection._id ? collection : c));
        }

        return [collection, ...prevClist];
      });
    };

    /**
     * Function to handle collection list updates from the socket.
     *
     * @param qid - The question ID.
     * @param answer - The answer object.
     */
    const handleCollectionListUpdate = (collections: Collection[]) => {
      setClist(collections);

      return collections;
    };

    fetchData();

    socket.on('collectionUpdate', handleCollectionUpdate);
    socket.on('collectionListUpdate', handleCollectionListUpdate);

    return () => {
      socket.off('collectionUpdate', handleCollectionUpdate);
      socket.off('collectionListUpdate', handleCollectionListUpdate);
    };
  }, [collectionOrder, socket, user.username]);

  return { clist, collectionOrder, setCollectionOrder, user };
};

export default useCollectionListPage;
