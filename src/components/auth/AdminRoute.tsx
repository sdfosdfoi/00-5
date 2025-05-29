import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminRoute: React.FC = () => {
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  
  // Если пользователь не админ, перенаправляем на дашборд
  if (!isAdmin()) {
    return <Navigate to="/dashboard\" replace />;
  }
  
  // Иначе рендерим дочерние маршруты
  return <Outlet />;
};

export default AdminRoute;