import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Room, RoomOrderType } from '../types';
import { getRoomsByFilter } from '../services/roomService';

/**
 * Custom hook for managing the question page state, filtering, and real-time updates.
 *
 * @returns titleText - The current title of the chat room page
 * @returns rlist - The list of rooms to display
 * @returns setChatOrder - Function to set the sorting order of chat rooms (e.g., newest, mostUsers).
 */
const useRoomPage = () => {
  const { socket } = useUserContext();

  const [searchParams] = useSearchParams();
  const [titleText, setTitleText] = useState<string>('All Chat Rooms');
  const [search, setSearch] = useState<string>('');
  const [chatOrder, setChatOrder] = useState<RoomOrderType>('newest');
  const [rlist, setRlist] = useState<Room[]>([]);

  useEffect(() => {
    let pageTitle = 'All Chat Rooms';
    let searchString = '';

    const searchQuery = searchParams.get('search');

    if (searchQuery) {
      pageTitle = 'Search Results';
      searchString = searchQuery;
    }

    setTitleText(pageTitle);
    setSearch(searchString);
  }, [searchParams]);

  useEffect(() => {
    /**
     * Function to fetch rooms based on the filter and update the room list.
     */
    const fetchData = async () => {
      try {
        const res = await getRoomsByFilter(chatOrder, search);
        setRlist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to handle room updates from the socket.
     *
     * @param room - the updated room object.
     */
    const handleRoomUpdate = (room: Room) => {
      setRlist(prevRlist => {
        const roomExists = prevRlist.some(r => r._id === room._id);

        if (roomExists) {
          // Update the existing room
          return prevRlist.map(r => (r._id === room._id ? room : r));
        }

        return [room, ...prevRlist];
      });
    };

    fetchData();

    socket.on('roomUpdate', handleRoomUpdate);

    return () => {
      socket.off('roomUpdate', handleRoomUpdate);
    };
  }, [chatOrder, search, socket]);

  return { titleText, rlist, setChatOrder };
};

export default useRoomPage;
