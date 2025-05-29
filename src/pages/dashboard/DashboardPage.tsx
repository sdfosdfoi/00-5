import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, BarChart3, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDescriptionStore } from '../../store/descriptionStore';

const DashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const getDescriptions = useDescriptionStore(state => state.getDescriptions);
  
  // Получаем последние описания пользователя
  const recentDescriptions = getDescriptions().slice(0, 3);
  
  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = 'Личный кабинет - ВидеоДескриптор';
  }, []);
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-8">
      {/* Приветствие */}
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Здравствуйте, {user?.firstName || 'пользователь'}!
        </h1>
        <p className="text-gray-600">
          Добро пожаловать в личный кабинет ВидеоДескриптора. Здесь вы можете создавать и управлять описаниями для своих видео.
        </p>
      </div>
      
      {/* Статистика и кнопки действий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Статистика */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <BarChart3 size={20} className="text-primary-600 mr-2" />
            <h2 className="text-lg font-medium">Статистика</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Всего описаний</p>
              <p className="text-2xl font-bold">{getDescriptions().length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Последнее описание</p>
              <p className="font-medium">
                {recentDescriptions.length > 0 
                  ? formatDate(recentDescriptions[0].createdAt)
                  : 'Нет описаний'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Создать описание */}
        <Link to="/dashboard/create" className="card p-6 hover:border-primary-300 transition-all group">
          <div className="flex items-center mb-4">
            <PlusCircle size={20} className="text-primary-600 mr-2 group-hover:scale-110 transition-transform" />
            <h2 className="text-lg font-medium">Создать описание</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Сгенерируйте новое описание для вашего видео с помощью искусственного интеллекта.
          </p>
          <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
            Начать генерацию →
          </span>
        </Link>
        
        {/* История запросов */}
        <Link to="/dashboard/history" className="card p-6 hover:border-primary-300 transition-all group">
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-primary-600 mr-2 group-hover:scale-110 transition-transform" />
            <h2 className="text-lg font-medium">История запросов</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Просмотр и управление всеми созданными вами описаниями для видео.
          </p>
          <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
            Открыть историю →
          </span>
        </Link>
      </div>
      
      {/* Последние описания */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Последние описания</h2>
          <Link to="/dashboard/history" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Смотреть все →
          </Link>
        </div>
        
        {recentDescriptions.length > 0 ? (
          <div className="space-y-4">
            {recentDescriptions.map((description) => (
              <div key={description.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center">
                      <Sparkles size={16} className="text-primary-600 mr-2" />
                      <h3 className="font-medium">{description.prompt}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(description.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md my-3">
                  {description.result}
                </p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => navigator.clipboard.writeText(description.result)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Копировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">У вас пока нет созданных описаний</p>
            <Link to="/dashboard/create" className="btn-primary">
              Создать первое описание
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;