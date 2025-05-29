import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  // Навигационные пункты админ-панели
  const adminNavItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Панель управления' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Пользователи' },
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Административная панель</h1>
        <p className="text-gray-600">Управление пользователями и системой</p>
        
        <div className="mt-6 border-b pb-2">
          <nav className="flex space-x-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;