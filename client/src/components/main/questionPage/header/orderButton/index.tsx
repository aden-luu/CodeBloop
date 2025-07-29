import React from 'react';
import { Button } from '@chakra-ui/react';
import { OrderType, orderTypeDisplayName } from '../../../../../types';

/**
 * Interface representing the props for the OrderButton component.
 *
 * name - The text to be displayed on the button.
 * setQuestionOrder - A function that sets the order of questions based on the message.
 */
interface OrderButtonProps {
  orderType: OrderType;
  setQuestionOrder: (order: OrderType) => void;
  isActive: boolean;
  setActiveOrder: (order: OrderType) => void;
}

/**
 * OrderButton component renders a button that, when clicked, triggers the setQuestionOrder function
 * with the provided message.
 * It will update the order of questions based on the input message.
 *
 * @param orderType - The label for the button and the value passed to setQuestionOrder function.
 * @param setQuestionOrder - Callback function to set the order of questions based on the input message.
 */
const OrderButton = ({
  orderType,
  setQuestionOrder,
  isActive,
  setActiveOrder,
}: OrderButtonProps) => {
  const handleOrderButtonClick = () => {
    setQuestionOrder(orderType);
    setActiveOrder(orderType);
  };

  return (
    <Button
      variant='solid'
      size='sm'
      bg={isActive ? 'brand.300' : 'brand.100'}
      color={isActive ? 'brand.100' : 'brand.300'}
      onClick={handleOrderButtonClick}
      _hover={{ bg: 'brand.300', color: 'brand.50' }}>
      {orderTypeDisplayName[orderType]}
    </Button>
  );
};

export default OrderButton;
