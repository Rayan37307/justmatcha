import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import type { JSX } from 'react';

type Props = {
  children: JSX.Element;
};

const AdminRoute = ({ children }: Props) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
