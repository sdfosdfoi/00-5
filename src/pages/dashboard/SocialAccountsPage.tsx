import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { GitBranch as BrandTelegram, Instagram, GitBranch as BrandTiktok, Link2, Unlink, AlertCircle } from 'lucide-react';
import { useSocialStore, type SocialPlatform } from '../../store/socialStore';

const SocialAccountsPage: React.FC = () => {
  const { accounts, connectAccount, disconnectAccount, loading } = useSocialStore();
  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);
  const [showTokenInput, setShowTokenInput] = useState<SocialPlatform | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    document.title = 'Подключенные соцсети - ВидеоДескриптор';
  }, []);

  const platforms = [
    {
      id: 'telegram' as SocialPlatform,
      name: 'Telegram',
      icon: BrandTelegram,
      description: 'Подключите Telegram-канал для автоматической публикации видео',
      color: 'text-blue-500',
      instructions: [
        'Создайте бота через @BotFather в Telegram',
        'Отправьте команду /newbot',
        'Следуйте инструкциям для создания бота',
        'Скопируйте токен бота',
        'Вставьте токен в поле ниже'
      ],
      placeholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
      videoRequirements: 'MP4, до 50MB'
    },
    {
      id: 'instagram' as SocialPlatform,
      name: 'Instagram',
      icon: Instagram,
      description: 'Подключите бизнес-аккаунт Instagram для публикации видео',
      color: 'text-pink-500',
      instructions: [
        'Перейдите на developers.facebook.com',
        'Создайте новое приложение',
        'Настройте Instagram Basic Display',
        'Скопируйте Client ID',
        'Вставьте Client ID в поле ниже'
      ],
      placeholder: 'Ваш Client ID',
      videoRequirements: 'MP4, до 100MB, максимум 60 секунд'
    },
    {
      id: 'tiktok' as SocialPlatform,
      name: 'TikTok',
      icon: BrandTiktok,
      description: 'Подключите TikTok для автоматической публикации видео',
      color: 'text-black',
      instructions: [
        'Перейдите на developers.tiktok.com',
        'Создайте новое приложение',
        'Скопируйте Client Key',
        'Вставьте Client Key в поле ниже'
      ],
      placeholder: 'Ваш Client Key',
      videoRequirements: 'MP4, до 500MB, от 3 до 60 секунд'
    }
  ];

  const handleConnect = async (platform: SocialPlatform) => {
    if (!token && showTokenInput !== platform) {
      setShowTokenInput(platform);
      return;
    }

    try {
      setConnectingPlatform(platform);
      await connectAccount(platform, token);
      toast.success(`Аккаунт ${platform} успешно подключен!`);
      setShowTokenInput(null);
      setToken('');
    } catch (error) {
      toast.error(`Ошибка при подключении ${platform}`);
      console.error(error);
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    try {
      await disconnectAccount(platform);
      toast.success(`Аккаунт ${platform} отключен`);
    } catch (error) {
      toast.error(`Ошибка при отключении ${platform}`);
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Подключенные соцсети</h1>
        <p className="text-gray-600">
          Подключите ваши социальные сети для автоматической публикации видео
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const isConnected = accounts.some(acc => acc.platform === platform.id);
          const Icon = platform.icon;
          const isShowingInput = showTokenInput === platform.id;
          
          return (
            <div key={platform.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Icon size={24} className={platform.color} />
                  <h3 className="text-lg font-medium ml-2">{platform.name}</h3>
                </div>
                {isConnected && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Подключено
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">
                {platform.description}
              </p>

              {isShowingInput && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder={platform.placeholder}
                    className="input mb-2"
                  />
                </div>
              )}

              <div className="space-y-4">
                <p className="text-xs text-gray-500">
                  Требования к видео: {platform.videoRequirements}
                </p>
                
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    disabled={loading}
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    <Unlink size={18} className="mr-2" />
                    Отключить
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={loading || connectingPlatform === platform.id}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {connectingPlatform === platform.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Подключение...
                      </>
                    ) : (
                      <>
                        <Link2 size={18} className="mr-2" />
                        {isShowingInput ? 'Подтвердить' : 'Подключить'}
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-6">
                <details className="group">
                  <summary className="flex items-center text-sm text-gray-500 cursor-pointer">
                    <AlertCircle size={16} className="mr-2" />
                    Инструкция по подключению
                  </summary>
                  <div className="mt-3 pl-6 text-sm text-gray-600">
                    <ol className="list-decimal space-y-2">
                      {platform.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialAccountsPage;