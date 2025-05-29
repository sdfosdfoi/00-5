import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Clock, Copy, Trash2, Check, Search, SortDesc } from 'lucide-react';
import { useDescriptionStore, VideoDescription } from '../../store/descriptionStore';

const HistoryPage: React.FC = () => {
  const getDescriptions = useDescriptionStore(state => state.getDescriptions);
  const deleteDescription = useDescriptionStore(state => state.deleteDescription);
  
  const [descriptions, setDescriptions] = useState<VideoDescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = 'История описаний - ВидеоДескриптор';
    
    // Загружаем описания
    const allDescriptions = getDescriptions();
    setDescriptions(sortDescriptions(allDescriptions, sortOrder));
  }, [getDescriptions]);
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Сортировка описаний
  const sortDescriptions = (descriptions: VideoDescription[], order: 'newest' | 'oldest') => {
    return [...descriptions].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };
  
  // Обработка изменения порядка сортировки
  const handleSortChange = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newOrder);
    setDescriptions(sortDescriptions(descriptions, newOrder));
  };
  
  // Фильтрация описаний по поисковому запросу
  const filteredDescriptions = descriptions.filter(
    desc => desc.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
           desc.result.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Копирование в буфер обмена
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Описание скопировано в буфер обмена!');
    
    setTimeout(() => {
      setCopiedId(null);
    }, 3000);
  };
  
  // Удаление описания
  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это описание?')) {
      deleteDescription(id);
      setDescriptions(descriptions.filter(desc => desc.id !== id));
      toast.success('Описание удалено!');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">История описаний</h1>
        <p className="text-gray-600">
          Здесь вы можете просмотреть все созданные вами описания для видео
        </p>
      </div>
      
      {/* Фильтры и поиск */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск описаний..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <button
          onClick={handleSortChange}
          className="inline-flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <SortDesc size={18} className="mr-2" />
          {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
        </button>
      </div>
      
      {/* Список описаний */}
      {filteredDescriptions.length > 0 ? (
        <div className="space-y-6">
          {filteredDescriptions.map((description) => (
            <div key={description.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">{description.prompt}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock size={14} className="mr-1" />
                    {formatDate(description.createdAt)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(description.result, description.id)}
                    className="inline-flex items-center px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {copiedId === description.id ? (
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
                  <button 
                    onClick={() => handleDelete(description.id)}
                    className="inline-flex items-center px-3 py-1 text-sm border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Удалить
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-800">{description.result}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          {searchTerm ? (
            <p className="text-gray-600">По запросу "{searchTerm}\" ничего не найдено</p>
          ) : (
            <p className="text-gray-600">У вас пока нет созданных описаний</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;