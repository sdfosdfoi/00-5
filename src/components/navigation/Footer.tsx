import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Youtube, Facebook } from 'lucide-react';
import Logo from '../Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Информация о компании */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Logo className="text-accent-400 mr-2" />
              <span className="text-xl font-bold">SWR Stats</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Сервис для аналитики и статистики стримеров.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Ссылки */}
          <div>
            <h3 className="font-bold text-lg mb-4">Сервис</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/#features" className="text-gray-400 hover:text-white transition-colors">
                  Возможности
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Регистрация
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Вход в систему
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Компания */}
          <div>
            <h3 className="font-bold text-lg mb-4">Компания</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  О нас
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Блог
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Карьера
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Партнёрская программа
                </a>
              </li>
            </ul>
          </div>
          
          {/* Поддержка */}
          <div>
            <h3 className="font-bold text-lg mb-4">Поддержка</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Центр помощи
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Документация API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Условия использования
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Нижняя часть футера */}
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 SWR Stats. Все права защищены.</p>
          <div className="mt-4 md:mt-0 flex items-center">
            <Mail size={16} className="mr-2" />
            <span>support@swrstats.ru</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;