import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Sparkles, Copy, Save, Check } from 'lucide-react';
import { useDescriptionStore, VideoDescription } from '../../store/descriptionStore';

interface FormData {
  prompt: string;
}

const CreateDescriptionPage: React.FC = () => {
  const generateDescription = useDescriptionStore(state => state.generateDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoDescription | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  useEffect(() => {
    document.title = 'Создание описания - ВидеоДескриптор';
  }, []);
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const description = await generateDescription(data.prompt);
      setResult(description);
      toast.success('Описание успешно сгенерировано!');
    } catch (error) {
      toast.error('Ошибка при генерации описания. Попробуйте позже.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.result);
      setCopied(true);
      toast.success('Описание скопировано в буфер обмена!');
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Создание описания для видео</h1>
        <p className="text-gray-600">
          Введите краткую информацию о вашем видео, и ИИ сгенерирует привлекательное описание
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-medium mb-4">Информация о видео</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                О чем ваше видео? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prompt"
                rows={5}
                {...register("prompt", { 
                  required: "Пожалуйста, введите описание видео",
                  minLength: {
                    value: 5,
                    message: "Описание должно содержать минимум 5 символов"
                  }
                })}
                placeholder="Например: Обзор нового iPhone 15 Pro Max, его основные характеристики, камера, производительность и мои впечатления после месяца использования."
                className="input"
              />
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
              )}
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
              <p className="font-medium mb-2">Советы для лучшего результата:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Укажите тему и основные пункты видео</li>
                <li>Упомяните целевую аудиторию</li>
                <li>Добавьте ключевые моменты, на которые стоит обратить внимание</li>
                <li>Чем конкретнее информация, тем лучше результат</li>
              </ul>
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
                  Генерация...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles size={18} className="mr-2" />
                  Сгенерировать описание
                </span>
              )}
            </button>
          </form>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Результат</h2>
            
            {result && (
              <div className="flex space-x-2">
                <button 
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="mr-1 text-green-500" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Копировать
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {result ? (
            <div className="bg-gray-50 p-4 rounded-md min-h-[200px]">
              <p className="text-gray-800 whitespace-pre-line">{result.result}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-md min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Здесь появится сгенерированное описание для вашего видео
              </p>
            </div>
          )}
          
          {result && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Вы всегда можете найти это описание в разделе "История"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDescriptionPage;