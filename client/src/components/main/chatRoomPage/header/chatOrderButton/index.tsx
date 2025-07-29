import React from 'react';
import { Button } from '@chakra-ui/react';
import { RoomOrderType } from '../../../../../types';

/**
 * Interface representing the props for the ChatOrderButton component.
 *
 * orderType - The type of ordering for the chat rooms (e.g., 'newest', 'mostUsers').
 * setChatOrder - Function to set the order of chat rooms.
 * isActive - Boolean indicating if this button is the active order.
 * setIsByNewest - Function to update the ordering state based on the selected option.
 */
interface ChatOrderButtonProps {
  orderType: RoomOrderType;
  setChatOrder: (order: RoomOrderType) => void;
  isActive: boolean;
  setIsByNewest: (isByNewest: boolean) => void;
}

/**
 * ChatOrderButton component renders a button that sets the order of chat rooms.
 * It displays "Newest" or "Most Users" based on the orderType, and highlights
 * the active selection with a color scheme.
 *
 * @param orderType - The order type to be applied.
 * @param setChatOrder - Function to update the chat room order.
 * @param isActive - Indicates if this button represents the current order.
 * @param setIsByNewest - Updates the sorting criteria state to "newest" if selected.
 */
const ChatOrderButton = ({
  orderType,
  setChatOrder,
  isActive,
  setIsByNewest,
}: ChatOrderButtonProps) => {
  const handleOrderButtonClick = () => {
    setChatOrder(orderType);
    setIsByNewest(orderType === 'newest');
  };

  return (
    <Button
      variant='solid'
      size='sm'
      bg={isActive ? 'brand.300' : 'brand.100'}
      color={isActive ? 'brand.100' : 'brand.300'}
      onClick={handleOrderButtonClick}
      _hover={{ bg: 'brand.300', color: 'brand.50' }}>
      {orderType === 'newest' ? 'Newest' : 'Most Users'}
    </Button>
  );
};

export default ChatOrderButton;
