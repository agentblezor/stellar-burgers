import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector((state) => state.feeds?.orders) || [];
  const feed = {
    total: useSelector((state) => state.feeds?.total) || 0,
    totalToday: useSelector((state) => state.feeds?.totalToday) || 0
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
