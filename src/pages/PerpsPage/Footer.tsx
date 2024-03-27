import React from 'react';
import { useOrderStream } from '@orderly.network/hooks';
import { OrderSide, OrderStatus, OrderType } from '@orderly.network/types';
import './Layout.scss';
import { Box } from '@material-ui/core';

type Order = {
  price: number;
  quantity: number;
  created_time: number;
  order_id: number;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  executed: number;
  average_executed_price: number;
};
export const Footer: React.FC<{ token: string; selectedTab: string }> = ({
  token,
  selectedTab,
}) => {
  const [orderStatus, setOrderStatus] = React.useState(OrderStatus.COMPLETED);
  // switch (selectedTab) {
  //   case 'Portfolio':
  //     setOrderStatus(OrderStatus.COMPLETED);
  //     break;
  //   case 'Pending':
  //     setOrderStatus(OrderStatus.INCOMPLETE);
  //     break;
  //   case 'Filled':
  //     setOrderStatus(OrderStatus.FILLED);
  //     break;
  //   case 'Cancelled':
  //     setOrderStatus(OrderStatus.CANCELLED);
  //     break;
  //   case 'Rejected':
  //     setOrderStatus(OrderStatus.REJECTED);
  //     break;
  //   case 'Order History':
  //     setOrderStatus(OrderStatus.COMPLETED);
  //     break;
  //   default:
  //     setOrderStatus(OrderStatus.COMPLETED);
  //     break;
  // }

  const [o] = useOrderStream({
    symbol: token,
    status: OrderStatus.COMPLETED,
  });
  const orders = o as Order[] | null;
  return (
    <div className='orders'>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div key={order?.order_id} className='order'>
            <span>{order?.price}</span>
            <span>{order?.quantity}</span>
            <span>{order?.created_time}</span>
            <span>{order?.side}</span>
            <span>{order?.type}</span>
            <span>{order?.status}</span>
            <span>{order?.average_executed_price}</span>
          </div>
        ))
      ) : (
        <Box padding='20px 16px' className='flex justify-center'>
          <small>No orders available</small>
        </Box>
      )}
    </div>
  );
};