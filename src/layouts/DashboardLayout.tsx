import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BrainCog, 
  LayoutDashboard, 
  PlusCircle, 
  Clock, 
  User, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert,
  Home,
  Share2,
  CalendarClock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const isAdmin = useAuthStore(state => state.isAdmin);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Навигационные пункты
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Главная' },
    { path: '/dashboard/create', icon: <PlusCircle size={20} />, label: 'Создать описание' },
    { path: '/dashboard/history', icon: <Clock size={20} />, label: 'История' },
    { path: '/dashboard/social', icon: <Share2 size={20} />, label: 'Соцсети' },
    { path: '/dashboard/schedule', icon: <CalendarClock size={20} />, label: 'Планировщик' },
    { path: '/dashboard/profile', icon: <User size={20} />, label: 'Профиль' },
  ];
  
  // Добавляем пункт админ-панели, если пользователь администратор
  if (isAdmin()) {
    navItems.push({ path: '/admin', icon: <ShieldAlert size={20} />, label: 'Админ-панель' });
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Мобильный заголовок */}
      <div className="bg-white p-4 flex items-center justify-between md:hidden border-b">
        <Link to="/dashboard" className="flex items-center">
          <BrainCog size={24} className="text-primary-600 mr-2" />
          <span className="font-bold text-lg">ВидеоДескриптор</span>
        </Link>
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Боковая панель */}
      <aside 
        className={`w-64 bg-white border-r shadow-sm transition-all duration-300 ${
          sidebarOpen ? 'fixed inset-0 z-50' : 'hidden md:block'
        }`}
      >
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center mb-8" onClick={() => setSidebarOpen(false)}>
            <BrainCog size={28} className="text-primary-600 mr-2" />
            <span className="font-bold text-xl">ВидеоДескриптор</span>
          </Link>
          
          <nav className="space-y-1">
            {/* Ссылка на главную страницу */}
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Home size={20} className="mr-3" />
              На сайт
            </Link>
            
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Выйти
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Основной контент */}
      <main className="flex-1">
        <div className="container-custom py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;