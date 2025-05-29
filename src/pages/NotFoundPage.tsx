import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = 'Страница не найдена - ВидеоДескриптор';
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-6 mb-8">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Похоже, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <Home size={18} className="mr-2" />
            На главную
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary w-full sm:w-auto"
          >
            <ArrowLeft size={18} className="mr-2" />
            Вернуться назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;