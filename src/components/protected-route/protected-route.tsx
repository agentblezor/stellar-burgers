import { FC, ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const accessToken = getCookie('accessToken');

  useEffect(() => {
    if (!isAuthChecked) {
      if (accessToken) {
        dispatch(getUser());
      } else {
        dispatch(setAuthChecked(true));
      }
    }
  }, [dispatch, isAuthChecked, accessToken]);

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
