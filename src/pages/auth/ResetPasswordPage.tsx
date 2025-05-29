import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BrainCog, Mail, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface ResetPasswordFormData {
  email: string;
}

const ResetPasswordPage: React.FC = () => {
  const resetPassword = useAuthStore(state => state.resetPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>();
  
  useEffect(() => {
    document.title = 'Сброс пароля - ВидеоДескриптор';
  }, []);
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      await resetPassword(data.email);
      setIsSubmitted(true);
      toast.success('Инструкции по сбросу пароля отправлены на вашу почту');
    } catch (error) {
      toast.error('Ошибка при отправке инструкций. Попробуйте позже.');
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
        <h2 className="text-2xl font-bold">Сброс пароля</h2>
        <p className="text-gray-600 mt-2">
          Введите ваш email, и мы отправим инструкции по сбросу пароля
        </p>
      </div>
      
      {isSubmitted ? (
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-lg mb-6">
            <p className="text-green-800">
              Инструкции по сбросу пароля отправлены на указанный email. Пожалуйста, проверьте вашу почту.
            </p>
          </div>
          <Link to="/login" className="inline-flex items-center text-primary-600 hover:text-primary-500">
            <ArrowLeft size={16} className="mr-1" />
            Вернуться на страницу входа
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("email", { 
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
                Отправка...
              </span>
            ) : (
              'Отправить инструкции'
            )}
          </button>
          
          <div className="text-center">
            <Link to="/login" className="inline-flex items-center text-primary-600 hover:text-primary-500">
              <ArrowLeft size={16} className="mr-1" />
              Вернуться на страницу входа
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;