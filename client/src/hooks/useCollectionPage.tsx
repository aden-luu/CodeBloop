import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Collection } from '../types';
import useUserContext from './useUserContext';
import { getCollectionById } from '../services/collectionService';

/**
 * Custom hook for managing the collection page's state, navigation, and real-time updates.
 *
 * @returns collectionID - The current collection ID retrieved from the URL parameters.
 * @returns collection - The current collection object with its questions.
 */
const useCollectionPage = () => {
  const { cid } = useParams();
  const navigate = useNavigate();

  const { socket } = useUserContext();
  const [collectionID, setCollectionID] = useState<string>(cid || '');
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (!cid) {
      navigate('/home');
      return;
    }

    setCollectionID(cid);
  }, [cid, navigate]);

  useEffect(() => {
    /**
     * Function to fetch the collection data based on the collection ID.
     */
    const fetchData = async () => {
      try {
        const res = await getCollectionById(collectionID);
        setCollection(res || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching question:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [collectionID]);

  useEffect(() => {
    /**
     * Function to handle updates to the collection.
     *
     * @param collection - The updated collection object.
     */
    const handleCollectionUpdate = (updatedCollection: Collection) => {
      setCollection(updatedCollection);
    };

    socket.on('collectionUpdate', handleCollectionUpdate);

    return () => {
      socket.off('collectionUpdate', handleCollectionUpdate);
    };
  }, [collectionID, socket]);

  return {
    collectionID,
    collection,
  };
};

export default useCollectionPage;
