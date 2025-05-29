import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, Upload, PenTool, ArrowRight, AlertTriangle, Share2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';

const HomePage: React.FC = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const [showTikTokWarning, setShowTikTokWarning] = useState(false);
  
  useEffect(() => {
    document.title = 'SWR Stats - Статистика и аналитика для стримеров';
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Главный баннер */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-gradient-to-br from-primary-800 to-primary-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <Logo size={600} />
          </div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
              Создавайте описания и автоматически публикуйте видео с помощью ИИ
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 animate-slide-up">
              Экономьте время и увеличивайте охваты с помощью автоматической публикации видео и качественных описаний, созданных искусственным интеллектом.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isLoggedIn() ? (
                <Link to="/dashboard/create\" className="btn-accent text-center">
                  Начать использовать <ArrowRight size={18} className="ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-accent text-center">
                    Бесплатная регистрация <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-center">
                    Войти в аккаунт
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-50"></div>
      </section>
      
      {/* Как это работает */}
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Автоматизируйте публикацию видео и создание описаний всего за три простых шага:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Шаг 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow animate-on-scroll">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Upload size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Загрузите видео</h3>
              <p className="text-gray-600">
                Загрузите ваше видео и укажите основную информацию о его содержании для создания оптимального описания.
              </p>
            </div>
            
            {/* Шаг 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow animate-on-scroll">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <PenTool size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. ИИ создаёт описание</h3>
              <p className="text-gray-600">
                Наш искусственный интеллект анализирует информацию и генерирует оптимизированное описание для каждой платформы.
              </p>
            </div>
            
            {/* Шаг 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow animate-on-scroll">
              <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Share2 size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Автопубликация</h3>
              <p className="text-gray-600">
                Настройте расписание, и система автоматически опубликует ваши видео в выбранные социальные сети.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Возможности */}
      <section className="py-20 bg-white" id="features">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Возможности сервиса</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ВидеоДескриптор предлагает полный набор инструментов для автоматизации публикации видео и создания качественного контента.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Возможность 1 */}
            <div className="flex animate-on-scroll">
              <div className="mr-5">
                <CheckCircle size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Автопостинг по расписанию</h3>
                <p className="text-gray-600">
                  Планируйте публикации заранее и позвольте системе автоматически размещать ваши видео в оптимальное время.
                </p>
              </div>
            </div>
            
            {/* Возможность 2 */}
            <div className="flex animate-on-scroll">
              <div className="mr-5">
                <CheckCircle size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Мультиплатформенная публикация</h3>
                <p className="text-gray-600">
                  Публикуйте видео одновременно в несколько социальных сетей с оптимизированными под каждую платформу описаниями.
                </p>
              </div>
            </div>
            
            {/* Возможность 3 */}
            <div className="flex animate-on-scroll">
              <div className="mr-5">
                <CheckCircle size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">ИИ-генерация описаний</h3>
                <p className="text-gray-600">
                  Создавайте уникальные и привлекательные описания для каждого видео с помощью искусственного интеллекта.
                </p>
              </div>
            </div>
            
            {/* Возможность 4 */}
            <div className="flex animate-on-scroll">
              <div className="mr-5">
                <CheckCircle size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Управление аккаунтами</h3>
                <p className="text-gray-600">
                  Подключайте и управляйте несколькими аккаунтами в разных социальных сетях из единого интерфейса.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Тарифы */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Тарифные планы</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Выберите тариф, который подходит именно вам. Начните бесплатно и переходите на другие планы по мере роста.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Бесплатный тариф */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-on-scroll">
              <div className="p-8">
                <h3 className="text-lg font-medium text-gray-400 mb-2">Бесплатный</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-4xl font-bold">0 ₽</span>
                  <span className="text-gray-500 ml-2">/месяц</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Идеально для тестирования сервиса.
                </p>
                <Link to="/register" className="block w-full py-3 px-4 text-center font-medium rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors">
                  Начать бесплатно
                </Link>
              </div>
              <div className="bg-gray-50 px-8 py-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">3 генерации в день</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">3 автопостинга для теста</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Базовые описания</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Стандартный тариф */}
            <div className="bg-white rounded-xl shadow-lg relative overflow-hidden border-2 border-primary-500 animate-on-scroll">
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                Популярный
              </div>
              <div className="p-8">
                <h3 className="text-lg font-medium text-gray-400 mb-2">Стандарт</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-4xl font-bold">499 ₽</span>
                  <span className="text-gray-500 ml-2">/месяц</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Для активных авторов контента.
                </p>
                <button className="block w-full py-3 px-4 text-center font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                  Выбрать тариф
                </button>
              </div>
              <div className="bg-gray-50 px-8 py-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">15 генераций в день</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">15 автопостингов в день</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">1 аккаунт на каждую соцсеть</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Расширенные описания</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Премиум тариф */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-on-scroll">
              <div className="p-8">
                <h3 className="text-lg font-medium text-gray-400 mb-2">Премиум</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-4xl font-bold">1299 ₽</span>
                  <span className="text-gray-500 ml-2">/месяц</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Для профессиональных блогеров.
                </p>
                <button className="block w-full py-3 px-4 text-center font-medium rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors">
                  Выбрать тариф
                </button>
              </div>
              <div className="bg-gray-50 px-8 py-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Безлимитные генерации</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Безлимитный автопостинг</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">До 4 аккаунтов на соцсеть</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Премиум описания</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Бизнес тариф */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-on-scroll">
              <div className="p-8">
                <h3 className="text-lg font-medium text-gray-400 mb-2">Бизнес</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-4xl font-bold">1499 ₽</span>
                  <span className="text-gray-500 ml-2">/месяц</span>
                </div>
                <p className="text-gray-600 mb-6">
                  Для компаний и агентств.
                </p>
                <button className="block w-full py-3 px-4 text-center font-medium rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors">
                  Выбрать тариф
                </button>
              </div>
              <div className="bg-gray-50 px-8 py-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Безлимитные генерации</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">Безлимитный автопостинг</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">До 10 аккаунтов на соцсеть</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-3 shrink-0" />
                    <span className="text-gray-600">+100₽ за каждый доп. аккаунт</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* TikTok Warning */}
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle size={24} className="text-orange-500 mt-1 mr-3 shrink-0" />
              <div>
                <h4 className="text-lg font-medium text-orange-800 mb-2">
                  Ограничения TikTok
                </h4>
                {showTikTokWarning ? (
                  <>
                    <p className="text-orange-700 mb-4">
                      Автоматическая публикация возможна только через одобренное бизнес-приложение, которое нужно регистрировать и одобрять вручную у TikTok.
                    </p>
                    <button
                      onClick={() => setShowTikTokWarning(false)}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Скрыть подробности
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowTikTokWarning(true)}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Подробнее
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Отзывы */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Что говорят наши пользователи</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Более 10,000 авторов контента уже используют нашу платформу для создания описаний и автопостинга.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Отзыв 1 */}
            <div className="bg-gray-50 rounded-xl p-8 animate-on-scroll">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} className="text-accent-500 fill-accent-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Сервис значительно упростил мою работу с YouTube-каналом. Теперь я экономлю до часа времени на каждом видео и получаю больше просмотров благодаря качественным описаниям и автопостингу."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary-700">АП</span>
                </div>
                <div>
                  <h4 className="font-medium">Алексей Петров</h4>
                  <p className="text-sm text-gray-500">YouTube-блогер</p>
                </div>
              </div>
            </div>
            
            {/* Отзыв 2 */}
            <div className="bg-gray-50 rounded-xl p-8 animate-on-scroll">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} className="text-accent-500 fill-accent-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Как контент-менеджер крупной компании, я обрабатываю до 20 видео в неделю. ВидеоДескриптор стал незаменимым инструментом в моей работе, особенно благодаря функции автопостинга."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary-700">ОС</span>
                </div>
                <div>
                  <h4 className="font-medium">Ольга Смирнова</h4>
                  <p className="text-sm text-gray-500">Контент-менеджер</p>
                </div>
              </div>
            </div>
            
            {/* Отзыв 3 */}
            <div className="bg-gray-50 rounded-xl p-8 animate-on-scroll">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={18} className={n <= 4 ? "text-accent-500 fill-accent-500" : "text-accent-500"} />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Начал использовать сервис недавно для своих TikTok-видео. Приятно удивлен качеством генерируемых описаний и удобством автопостинга. Рекомендую всем начинающим блогерам!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-primary-700">ДК</span>
                </div>
                <div>
                  <h4 className="font-medium">Дмитрий Козлов</h4>
                  <p className="text-sm text-gray-500">TikTok-блогер</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Готовы автоматизировать публикацию видео?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам авторов, которые уже используют ВидеоДескриптор для автоматизации своего контента.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn() ? (
              <Link to="/dashboard/create\" className="btn-accent text-center">
                Создать новое описание <ArrowRight size={18} className="ml-2" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-accent text-center">
                  Зарегистрироваться бесплатно <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/login" className="btn-secondary text-center">
                  Войти в аккаунт
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;