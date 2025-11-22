import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients?.isLoading
  );
  const ingredients =
    useSelector((state) => state.ingredients?.ingredients) || [];
  const error = useSelector((state) => state.ingredients?.error);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isIngredientsLoading && ingredients.length === 0) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      {error && (
        <div className='pl-5'>
          <p className='text text_type_main-default text_color_error'>
            Ошибка: {error}
          </p>
        </div>
      )}
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
