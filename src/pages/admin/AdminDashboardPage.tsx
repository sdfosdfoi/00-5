import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Users, FileText, Activity, AlertTriangle, DollarSign, TrendingUp, Share2, BarChart2, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const AdminDashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [showReferralStats, setShowReferralStats] = useState(false);
  const [newReferralName, setNewReferralName] = useState('');
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);
  
  const { referralStats, generateReferralCode, addReferralRegistration } = useAuthStore();
  
  useEffect(() => {
    document.title = 'Админ-панель - SWR Stats';
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const toggleReferralDetails = (referralId: string) => {
    setExpandedReferral(expandedReferral === referralId ? null : referralId);
  };

  const handleCreateReferral = () => {
    if (!newReferralName.trim()) {
      toast.error('Введите имя блогера');
      return;
    }

    const code = generateReferralCode(newReferralName);
    addReferralRegistration(code, {
      id: Date.now().toString(),
      name: newReferralName,
      email: '',
      plan: 'free',
      monthlyPayment: 0
    });
    toast.success(`Реферальный код создан: ${code}`);
    setShowNewReferralModal(false);
    setNewReferralName('');
  };

  // Calculate total stats
  const totalStats = Object.values(referralStats).reduce((acc, stat) => {
    return {
      totalUsers: acc.totalUsers + stat.registrations,
      activeUsers: acc.activeUsers + stat.users.filter(u => u.status === 'active').length,
      totalPosts: acc.totalPosts + stat.users.length * 10,
      totalViews: acc.totalViews + stat.users.length * 1000,
      totalRevenue: acc.totalRevenue + stat.users.reduce((sum, u) => sum + u.monthlyPayment, 0),
      activeSubscriptions: {
        free: acc.activeSubscriptions.free + stat.users.filter(u => u.plan === 'free' && u.status === 'active').length,
        standard: acc.activeSubscriptions.standard + stat.users.filter(u => u.plan === 'standard' && u.status === 'active').length,
        premium: acc.activeSubscriptions.premium + stat.users.filter(u => u.plan === 'premium' && u.status === 'active').length,
        business: acc.activeSubscriptions.business + stat.users.filter(u => u.plan === 'business' && u.status === 'active').length
      }
    };
  }, {
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalViews: 0,
    totalRevenue: 0,
    activeSubscriptions: {
      free: 0,
      standard: 0,
      premium: 0,
      business: 0
    }
  });

  // Get recent payments from referral stats
  const recentPayments = Object.entries(referralStats).flatMap(([code, stat]) => 
    stat.users.map(user => ({
      id: `${user.id}-payment`,
      user: user.name,
      amount: user.monthlyPayment,
      plan: user.plan,
      date: user.registrationDate,
      status: 'success',
      referralCode: code
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Панель управления</h1>
          <p className="text-gray-600">
            Общая статистика, аналитика и управление реферальной системой
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => setShowReferralStats(!showReferralStats)}
            className="btn-secondary"
          >
            {showReferralStats ? 'Скрыть статистику рефералов' : 'Статистика рефералов'}
          </button>
          <button
            onClick={() => setShowNewReferralModal(true)}
            className="btn-primary"
          >
            Создать реферальный код
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Период:</span>
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setSelectedPeriod('day')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              selectedPeriod === 'day'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border`}
          >
            День
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 text-sm font-medium -ml-px ${
              selectedPeriod === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border`}
          >
            Неделя
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md -ml-px ${
              selectedPeriod === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border`}
          >
            Месяц
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Пользователи</p>
              <h3 className="text-2xl font-bold">{formatNumber(totalStats.totalUsers)}</h3>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Активных: {formatNumber(totalStats.activeUsers)} ({totalStats.totalUsers ? Math.round((totalStats.activeUsers / totalStats.totalUsers) * 100) : 0}%)
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Публикации</p>
              <h3 className="text-2xl font-bold">{formatNumber(totalStats.totalPosts)}</h3>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Просмотров: {formatNumber(totalStats.totalViews)}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <DollarSign size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Выручка</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalStats.totalRevenue)}</h3>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {totalStats.totalRevenue > 0 ? '+15% к прошлому месяцу' : 'Нет данных'}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <Activity size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Активные подписки</p>
              <h3 className="text-2xl font-bold">
                {formatNumber(
                  Object.values(totalStats.activeSubscriptions).reduce((a, b) => a + b, 0)
                )}
              </h3>
            </div>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Бизнес:</span>
              <span className="font-medium">{totalStats.activeSubscriptions.business}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Премиум:</span>
              <span className="font-medium">{totalStats.activeSubscriptions.premium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Стандарт:</span>
              <span className="font-medium">{totalStats.activeSubscriptions.standard}</span>
            </div>
          </div>
        </div>
      </div>

      {showReferralStats && (
        <div className="card">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Статистика рефералов</h2>
            <p className="text-sm text-gray-500 mt-1">
              Детальная информация по реферальной программе
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {Object.entries(referralStats).map(([code, referral]) => (
              <div key={code} className="p-6">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleReferralDetails(code)}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-lg">
                        {code.slice(0, 2)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{code}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">Регистрации: {formatNumber(referral.registrations)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-right mr-8">
                      <div className="text-lg font-medium text-gray-900">
                        {formatCurrency(referral.users.reduce((sum, user) => sum + user.monthlyPayment, 0))}
                      </div>
                      <div className="text-sm text-gray-500">Всего заработано</div>
                    </div>
                    {expandedReferral === code ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {expandedReferral === code && (
                  <div className="mt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Комиссионные</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-700">Месячная комиссия:</p>
                          <p className="text-lg font-medium text-blue-900">
                            {formatCurrency(referral.users.reduce((sum, user) => sum + user.monthlyPayment * 0.3, 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">Всего заработано:</p>
                          <p className="text-lg font-medium text-blue-900">
                            {formatCurrency(referral.users.reduce((sum, user) => sum + user.monthlyPayment, 0))}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 mb-4">Привлеченные пользователи</h4>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Пользователь
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Тариф
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Дата подписки
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Платеж
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Комиссия (30%)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Статус
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {referral.users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="capitalize text-sm text-gray-900">{user.plan}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.registrationDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(user.monthlyPayment)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                {formatCurrency(user.monthlyPayment * 0.3)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.status === 'active' ? 'Активен' : 'Неактивен'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Последние платежи</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тариф
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Реферал
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">{payment.plan}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(payment.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {payment.referralCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Успешно
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewReferralModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Создать реферальный код
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="bloggerName" className="block text-sm font-medium text-gray-700">
                    Имя блогера
                  </label>
                  <input
                    type="text"
                    id="bloggerName"
                    value={newReferralName}
                    onChange={(e) => setNewReferralName(e.target.value)}
                    className="mt-1 input"
                    placeholder="Введите имя блогера"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => {
                  setShowNewReferralModal(false);
                  setNewReferralName('');
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateReferral}
                className="btn-primary"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;