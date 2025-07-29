import React from 'react';
import { Button } from '@chakra-ui/react';
import { CollectionOrderType, collectionOrderTypeDisplayName } from '../../../../../types';

/**
 * Interface representing the props for the OrderButton component.
 *
 * - collectionOrderType The type of collection order to be applied.
 * - setCollectionOrder Callback function to update the collection order.
 * - currentOrder The current active order type.
 */
interface CollectionOrderButtonProps {
  collectionOrderType: CollectionOrderType;
  setCollectionOrder: (order: CollectionOrderType) => void;
  currentOrder: CollectionOrderType;
}

/**
 * OrderButton component that displays a button for setting the order of collections.
 * Highlights the button if it matches the current order and updates the order on click.
 *
 * @param collectionOrderType The type of collection order represented by this button.
 * @param setCollectionOrder Callback function to set the collection order.
 * @param currentOrder The currently selected collection order.
 */
const OrderButton = ({
  collectionOrderType,
  setCollectionOrder,
  currentOrder,
}: CollectionOrderButtonProps) => (
  <Button
    variant='solid'
    size='sm'
    bg={currentOrder === collectionOrderType ? 'brand.100' : 'brand.300'}
    color={currentOrder === collectionOrderType ? 'brand.300' : 'brand.100'}
    onClick={() => setCollectionOrder(collectionOrderType)}
    _hover={{ bg: 'brand.300', color: 'brand.50' }}>
    {collectionOrderTypeDisplayName[collectionOrderType]}
  </Button>
);

export default OrderButton;
