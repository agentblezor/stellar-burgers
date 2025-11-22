import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
<<<<<<< HEAD
import { clearConstructor } from '../../services/slices/constructorSlice';
=======
>>>>>>> main

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order?.isLoading) || false;
  const orderModalData = useSelector((state) => state.order?.order) || null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='));
    if (!accessToken) {
      navigate('/login');
      return;
    }
    dispatch(createOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
<<<<<<< HEAD
    dispatch(clearConstructor());
=======
>>>>>>> main
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems?.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice =
      constructorItems?.ingredients &&
      Array.isArray(constructorItems.ingredients)
        ? constructorItems.ingredients.reduce(
            (s: number, v: TConstructorIngredient) => s + v.price,
            0
          )
        : 0;
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
