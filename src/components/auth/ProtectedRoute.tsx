import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  
  // Иначе рендерим дочерние маршруты
  return <Outlet />;
};

export default ProtectedRoute;