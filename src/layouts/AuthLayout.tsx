import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BrainCog } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  
  // Если пользователь уже авторизован, перенаправляем на дашборд
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Боковая панель с информацией */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center mb-12">
            <BrainCog size={40} className="text-accent-400 mr-3" />
            <h1 className="text-2xl font-bold">ВидеоДескриптор</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Создавайте привлекательные описания для ваших видео с помощью ИИ
          </h2>
          
          <p className="text-lg text-gray-300 mb-8">
            Наш сервис поможет вам быстро и легко генерировать качественные описания для видео на YouTube, TikTok, Instagram и других платформах.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold">1</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-1">Зарегистрируйтесь</h3>
                <p className="text-gray-300">Создайте бесплатный аккаунт, чтобы начать работу</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-1">Опишите видео</h3>
                <p className="text-gray-300">Введите краткое описание того, о чём ваше видео</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold">3</span>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-1">Получите результат</h3>
                <p className="text-gray-300">Используйте сгенерированное описание для вашего видео</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          © 2025 ВидеоДескриптор. Все права защищены.
        </div>
      </div>
      
      {/* Контент (формы авторизации) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;