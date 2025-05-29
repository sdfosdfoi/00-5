import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BrainCog, Mail, Lock, User, UserPlus, Gift } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore(state => state.register);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register: registerField, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const password = watch("password");
  
  useEffect(() => {
    document.title = 'Регистрация - ВидеоДескриптор';
  }, []);
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await register(data.email, data.password, data.firstName, data.lastName);
      
      if (data.referralCode) {
        // В реальном приложении здесь был бы запрос к API для обработки реферального кода
        console.log('Referral code used:', data.referralCode);
      }
      
      toast.success('Регистрация прошла успешно!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Ошибка при регистрации. Попробуйте позже.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <BrainCog size={32} className="text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold">Создать аккаунт</h2>
        <p className="text-gray-600 mt-2">
          Зарегистрируйтесь, чтобы начать использовать все возможности сервиса
        </p>
      </div>
      
      {/* Реферальный код */}
      <div className="mb-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 border border-primary-100">
        <div className="flex items-start">
          <Gift size={24} className="text-primary-600 mr-3 mt-1 shrink-0" />
          <div>
            <h3 className="font-medium text-primary-900">У вас есть реферальный код?</h3>
            <p className="text-sm text-primary-700 mt-1">
              Введите его ниже, чтобы получить дополнительные бонусы при регистрации
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Реферальный код */}
        <div>
          <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-1">
            Реферальный код
          </label>
          <input
            id="referralCode"
            type="text"
            {...registerField("referralCode")}
            className="input uppercase"
            placeholder="Например: ALEX2025"
          />
        </div>
        
        {/* Имя и Фамилия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {...registerField("firstName", { 
                  required: "Имя обязательно" 
                })}
                className="input pl-10"
                placeholder="Иван"
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
              {...registerField("lastName", { 
                required: "Фамилия обязательна" 
              })}
              className="input"
              placeholder="Петров"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        {/* Email */}
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
              {...registerField("email", { 
                required: "Email обязателен", 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email"
                }
              })}
              className="input pl-10"
              placeholder="your@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        {/* Пароль */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              {...registerField("password", { 
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов"
                }
              })}
              className="input pl-10"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        {/* Подтверждение пароля */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Подтверждение пароля
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...registerField("confirmPassword", { 
              required: "Подтвердите пароль",
              validate: value => value === password || "Пароли не совпадают"
            })}
            className="input"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        {/* Кнопка регистрации */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Регистрация...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <UserPlus size={18} className="mr-2" />
              Зарегистрироваться
            </span>
          )}
        </button>
      </form>
      
      {/* Условия использования */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Регистрируясь, вы соглашаетесь с нашими{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500">
          Условиями использования
        </a>{' '}
        и{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500">
          Политикой конфиденциальности
        </a>
      </div>
      
      {/* Ссылка на вход */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;