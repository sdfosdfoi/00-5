import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Logo from '../Logo';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center">
          <Logo className={scrolled ? 'text-primary-600' : 'text-white'} />
          <span className={`text-xl font-bold ml-2 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            SWR Stats
          </span>
        </Link>
        
        {/* Десктопное меню */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'
            }`}
          >
            Главная
          </Link>
          <Link 
            to="/#features" 
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'
            }`}
          >
            Возможности
          </Link>
          <Link 
            to="/#pricing" 
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'
            }`}
          >
            Тарифы
          </Link>
          
          {/* Кнопки авторизации */}
          <div className="flex items-center space-x-4">
            {isLoggedIn() ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Личный кабинет
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
        
        {/* Мобильное меню */}
        <button 
          className={`md:hidden p-2 rounded-md ${
            scrolled ? 'text-gray-700' : 'text-white'
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Мобильное меню (выпадающее) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container-custom py-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Главная
            </Link>
            <Link 
              to="/#features" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Возможности
            </Link>
            <Link 
              to="/#pricing" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Тарифы
            </Link>
            
            <div className="pt-4 border-t flex flex-col space-y-3">
              {isLoggedIn() ? (
                <Link 
                  to="/dashboard" 
                  className="w-full btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Личный кабинет
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="w-full btn-secondary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;