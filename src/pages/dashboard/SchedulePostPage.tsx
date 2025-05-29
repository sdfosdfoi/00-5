import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { GitBranch as BrandTelegram, Instagram, GitBranch as BrandTiktok, Calendar, Clock, Send, Upload, Play, X } from 'lucide-react';
import { useSocialStore, type SocialPlatform } from '../../store/socialStore';

interface FormData {
  text: string;
  platforms: SocialPlatform[];
  scheduledDate?: Date;
}

const SchedulePostPage: React.FC = () => {
  const { accounts, schedulePost, publishNow, loading } = useSocialStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const selectedPlatforms = (watch('platforms') || []) as SocialPlatform[];

  useEffect(() => {
    document.title = 'Планирование публикации - ВидеоДескриптор';
  }, []);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('video/')) {
        toast.error('Пожалуйста, выберите видеофайл');
        return;
      }

      if (file.size > 500 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 500MB');
        return;
      }

      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }

      const previewUrl = URL.createObjectURL(file);
      setSelectedVideo(file);
      setVideoPreviewUrl(previewUrl);
      toast.success('Видео выбрано: ' + file.name);
    }
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setSelectedVideo(null);
    setVideoPreviewUrl(null);
  };

  const handlePost = async (data: FormData) => {
    try {
      if (selectedPlatforms.length === 0) {
        toast.error('Выберите хотя бы одну платформу');
        return;
      }

      if (!selectedVideo) {
        toast.error('Пожалуйста, выберите видео для публикации');
        return;
      }

      const content = {
        text: data.text,
        video: selectedVideo
      };

      if (isScheduling && selectedDate) {
        for (const platform of selectedPlatforms) {
          await schedulePost({
            userId: 'current-user',
            platform,
            content,
            scheduledFor: selectedDate.toISOString(),
            status: 'pending'
          });
        }
        toast.success('Публикация видео запланирована!');
      } else {
        for (const platform of selectedPlatforms) {
          await publishNow(platform, content);
        }
        toast.success('Видео опубликовано!');
      }

      handleRemoveVideo();
    } catch (error) {
      toast.error('Ошибка при публикации');
      console.error(error);
    }
  };

  // Only show platforms that are connected
  const connectedPlatforms = accounts.map(account => {
    switch (account.platform) {
      case 'telegram':
        return {
          id: 'telegram' as SocialPlatform,
          name: 'Telegram',
          icon: BrandTelegram,
          color: 'text-blue-500',
          videoRequirements: 'MP4, до 50MB'
        };
      case 'instagram':
        return {
          id: 'instagram' as SocialPlatform,
          name: 'Instagram',
          icon: Instagram,
          color: 'text-pink-500',
          videoRequirements: 'MP4, до 100MB, максимум 60 секунд'
        };
      case 'tiktok':
        return {
          id: 'tiktok' as SocialPlatform,
          name: 'TikTok',
          icon: BrandTiktok,
          color: 'text-black',
          videoRequirements: 'MP4, до 500MB, от 3 до 60 секунд'
        };
      default:
        return null;
    }
  }).filter((platform): platform is NonNullable<typeof platform> => platform !== null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Планирование публикации</h1>
        <p className="text-gray-600">
          Создайте и запланируйте публикацию видео для ваших социальных сетей
        </p>
      </div>

      <form onSubmit={handleSubmit(handlePost)} className="space-y-6">
        {/* Выбор платформ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите платформы
          </label>
          {connectedPlatforms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {connectedPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <label
                    key={platform.id}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPlatforms.includes(platform.id)
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={platform.id}
                      {...register('platforms')}
                      className="sr-only"
                    />
                    <Icon size={24} className={`${platform.color} mr-3`} />
                    <div>
                      <span className="font-medium">{platform.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{platform.videoRequirements}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">У вас нет подключенных соцсетей</p>
              <a href="/dashboard/social" className="btn-primary">
                Подключить соцсети
              </a>
            </div>
          )}
        </div>

        {connectedPlatforms.length > 0 && (
          <>
            {/* Загрузка видео */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Видео для публикации
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  {selectedVideo ? (
                    <div className="space-y-2">
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center truncate">
                          <Play size={16} className="shrink-0 mr-2 text-gray-500" />
                          <span className="truncate text-sm">
                            {selectedVideo.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="shrink-0 ml-2 text-gray-500 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="video-upload"
                      className="btn-secondary w-full flex items-center justify-center cursor-pointer"
                    >
                      <Upload size={18} className="mr-2" />
                      Загрузить видео
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Текст публикации */}
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Текст публикации
              </label>
              <textarea
                id="text"
                rows={5}
                {...register('text', {
                  required: 'Введите текст публикации',
                  minLength: {
                    value: 10,
                    message: 'Минимальная длина текста - 10 символов'
                  }
                })}
                className="input"
                placeholder="Введите текст вашей публикации..."
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
              )}
            </div>

            {/* Планирование */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Clock size={20} className="text-gray-500 mr-2" />
                <h3 className="text-lg font-medium">Время публикации</h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isScheduling}
                    onChange={() => setIsScheduling(false)}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2">Опубликовать сейчас</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isScheduling}
                    onChange={() => setIsScheduling(true)}
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2">Запланировать на определённое время</span>
                </label>

                {isScheduling && (
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        className="input pl-10"
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </div>
                    {isScheduling && !selectedDate && (
                      <p className="mt-1 text-sm text-red-600">
                        Выберите дату и время публикации
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Кнопка публикации */}
            <button
              type="submit"
              disabled={loading || (isScheduling && !selectedDate) || !selectedVideo}
              className={`w-full btn-primary ${
                loading || (isScheduling && !selectedDate) || !selectedVideo ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isScheduling ? 'Планирование...' : 'Публикация...'}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Send size={18} className="mr-2" />
                  {isScheduling ? 'Запланировать публикацию' : 'Опубликовать сейчас'}
                </span>
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SchedulePostPage;