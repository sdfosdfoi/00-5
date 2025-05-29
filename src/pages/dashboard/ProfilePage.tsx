import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Mail, Save, BarChart2, Users, Clock, Share2, ArrowUpRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const { accounts, fetchStats } = useSocialStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showStatsDetails, setShowStatsDetails] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileFormData>();
  const newPassword = watch("newPassword");

  useEffect(() => {
    document.title = 'Профиль - SWR Stats';
    
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }

    // Fetch fresh stats for all connected accounts
    accounts.forEach(account => {
      fetchStats(account.platform).catch(console.error);
    });
  }, [user, reset, accounts, fetchStats]);

  // Calculate total statistics from actual account data
  const totalStats = accounts.reduce((acc, account) => {
    const stats = account.stats;
    return {
      followers: acc.followers + (stats?.followers || 0),
      views: acc.views + (stats?.views || 0),
      engagement: acc.engagement + (stats?.engagement || 0),
      posts: acc.posts + (stats?.posts || 0)
    };
  }, { followers: 0, views: 0, engagement: 0, posts: 0 });

  // Calculate average engagement
  if (totalStats.posts > 0) {
    totalStats.engagement = totalStats.engagement / accounts.length;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Нет данных';
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      toast.success('Профиль успешно обновлен!');
      
      if (data.newPassword) {
        reset({
          ...data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsPasswordVisible(false);
      }
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Профиль пользователя</h1>
        <p className="text-gray-600">
          Управление профилем и просмотр статистики
        </p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Подписчики</p>
              <h3 className="text-2xl font-bold">{formatNumber(totalStats.followers)}</h3>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Общее количество подписчиков
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <BarChart2 size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Просмотры</p>
              <h3 className="text-2xl font-bold">{formatNumber(totalStats.views)}</h3>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Общее количество просмотров
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <Share2 size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Вовлеченность</p>
              <h3 className="text-2xl font-bold">{totalStats.engagement.toFixed(1)}%</h3>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Средний показатель вовлеченности
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <Clock size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Публикации</p>
              <h3 className="text-2xl font-bold">{formatNumber(totalStats.posts)}</h3>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Общее количество публикаций
          </div>
        </div>
      </div>

      {/* Статистика по платформам */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Статистика по платформам</h2>
          <button
            onClick={() => setShowStatsDetails(!showStatsDetails)}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
          >
            {showStatsDetails ? 'Скрыть детали' : 'Показать детали'}
            <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>

        {accounts.length > 0 ? (
          <div className="space-y-6">
            {accounts.map(account => (
              <div key={account.id} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium capitalize">{account.platform}</h3>
                  <span className="text-sm text-gray-500">Подключено</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Подписчики</p>
                    <p className="text-lg font-bold">{formatNumber(account.stats?.followers || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Просмотры</p>
                    <p className="text-lg font-bold">{formatNumber(account.stats?.views || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Вовлеченность</p>
                    <p className="text-lg font-bold">{(account.stats?.engagement || 0).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Публикации</p>
                    <p className="text-lg font-bold">{account.stats?.posts || 0}</p>
                  </div>

                  {showStatsDetails && account.stats && (
                    <div className="col-span-2 md:col-span-4 mt-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Детальная статистика</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Лайки</p>
                            <p className="font-medium">{formatNumber(account.stats.likes || 0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Комментарии</p>
                            <p className="font-medium">{formatNumber(account.stats.comments || 0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Репосты</p>
                            <p className="font-medium">{formatNumber(account.stats.shares || 0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Сохранения</p>
                            <p className="font-medium">{formatNumber(account.stats.saves || 0)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">У вас нет подключенных социальных сетей</p>
            <p className="text-sm text-gray-500">
              Подключите социальные сети в разделе "Соцсети", чтобы видеть статистику
            </p>
          </div>
        )}
      </div>

      {/* Форма профиля */}
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName", { 
                    required: "Имя обязательно" 
                  })}
                  className="input pl-10"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName", { 
                  required: "Фамилия обязательна" 
                })}
                className="input"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                disabled
                {...register("email")}
                className="input pl-10 bg-gray-50 text-gray-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Email нельзя изменить после регистрации
            </p>
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Смена пароля</h3>
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="text-sm text-primary-600"
              >
                {isPasswordVisible ? 'Скрыть' : 'Изменить пароль'}
              </button>
            </div>
            
            {isPasswordVisible && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Текущий пароль
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword", { 
                      required: "Введите текущий пароль"
                    })}
                    className="input"
                    placeholder="••••••••"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Новый пароль
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    {...register("newPassword", { 
                      required: "Введите новый пароль",
                      minLength: {
                        value: 6,
                        message: "Пароль должен содержать минимум 6 символов"
                      }
                    })}
                    className="input"
                    placeholder="••••••••"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Подтверждение нового пароля
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", { 
                      required: "Подтвердите новый пароль",
                      validate: value => value === newPassword || "Пароли не совпадают"
                    })}
                    className="input"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Информация об аккаунте</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Дата регистрации:</span>{' '}
                <span className="font-medium">{formatDate(user?.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-500">Статус:</span>{' '}
                <span className="font-medium">Активен</span>
              </div>
              <div>
                <span className="text-gray-500">Тип аккаунта:</span>{' '}
                <span className="font-medium">{user?.isAdmin ? 'Администратор' : 'Пользователь'}</span>
              </div>
              <div>
                <span className="text-gray-500">Тариф:</span>{' '}
                <span className="font-medium">Бесплатный</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Сохранение...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Save size={18} className="mr-2" />
                  Сохранить изменения
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;