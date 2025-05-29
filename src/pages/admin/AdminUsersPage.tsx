import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Filter, UserPlus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

// Типы для пользователя
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'blocked';
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
  descriptionsCount: number;
}

const AdminUsersPage: React.FC = () => {
  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = 'Управление пользователями - ВидеоДескриптор';
  }, []);
  
  // Состояния
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Пример пользователей (в реальном приложении были бы из API)
  const mockUsers: User[] = [
    { 
      id: '1', 
      name: 'Админ Администраторов', 
      email: 'admin@example.com', 
      status: 'active',
      role: 'admin',
      createdAt: '2025-01-15T12:00:00Z',
      lastLogin: '2025-04-10T08:45:00Z',
      descriptionsCount: 5
    },
    { 
      id: '2', 
      name: 'Иван Петров', 
      email: 'user@example.com', 
      status: 'active',
      role: 'user',
      createdAt: '2025-02-20T14:30:00Z',
      lastLogin: '2025-04-09T16:20:00Z',
      descriptionsCount: 12
    },
    { 
      id: '3', 
      name: 'Анна Сидорова', 
      email: 'anna@example.com', 
      status: 'active',
      role: 'user',
      createdAt: '2025-03-05T09:15:00Z',
      lastLogin: '2025-04-08T11:10:00Z',
      descriptionsCount: 8
    },
    { 
      id: '4', 
      name: 'Павел Николаев', 
      email: 'pavel@example.com', 
      status: 'inactive',
      role: 'user',
      createdAt: '2025-03-10T16:45:00Z',
      lastLogin: '2025-03-20T13:30:00Z',
      descriptionsCount: 3
    },
    { 
      id: '5', 
      name: 'Елена Смирнова', 
      email: 'elena@example.com', 
      status: 'blocked',
      role: 'user',
      createdAt: '2025-03-15T10:20:00Z',
      lastLogin: '2025-03-18T09:15:00Z',
      descriptionsCount: 2
    },
    { 
      id: '6', 
      name: 'Сергей Иванов', 
      email: 'sergey@example.com', 
      status: 'active',
      role: 'user',
      createdAt: '2025-03-20T13:40:00Z',
      lastLogin: '2025-04-07T14:25:00Z',
      descriptionsCount: 6
    },
  ];
  
  // Фильтрация пользователей
  const filteredUsers = mockUsers.filter(user => {
    // Поиск по имени или email
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Фильтр по статусу
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    // Фильтр по роли
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Обработчик изменения статуса пользователя
  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'blocked') => {
    toast.success(`Статус пользователя изменен на: ${
      newStatus === 'active' ? 'Активен' :
      newStatus === 'inactive' ? 'Неактивен' : 'Заблокирован'
    }`);
  };
  
  // Обработчик удаления пользователя
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      toast.success('Пользователь успешно удален');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Управление пользователями</h1>
        <p className="text-gray-600">
          Просмотр и управление учетными записями пользователей
        </p>
      </div>
      
      {/* Панель фильтров и поиска */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input max-w-[150px]"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
              <option value="blocked">Заблокированные</option>
            </select>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input max-w-[150px]"
          >
            <option value="all">Все роли</option>
            <option value="admin">Администраторы</option>
            <option value="user">Пользователи</option>
          </select>
        </div>
        
        <button className="btn-primary">
          <UserPlus size={18} className="mr-2" />
          Добавить пользователя
        </button>
      </div>
      
      {/* Таблица пользователей */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Регистрация
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Последний вход
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описания
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' 
                          ? 'Активен' 
                          : user.status === 'inactive'
                            ? 'Неактивен'
                            : 'Заблокирован'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.descriptionsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          title="Редактировать"
                        >
                          <Edit size={18} />
                        </button>
                        
                        {user.status !== 'blocked' ? (
                          <button 
                            className="text-red-500 hover:text-red-700"
                            title="Заблокировать"
                            onClick={() => handleStatusChange(user.id, 'blocked')}
                          >
                            <UserX size={18} />
                          </button>
                        ) : (
                          <button 
                            className="text-green-500 hover:text-green-700"
                            title="Разблокировать"
                            onClick={() => handleStatusChange(user.id, 'active')}
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        
                        <button 
                          className="text-red-500 hover:text-red-700"
                          title="Удалить"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    По вашему запросу ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;